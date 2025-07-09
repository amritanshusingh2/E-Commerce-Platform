package in.all.security;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import reactor.core.publisher.Mono;

@Component
public class JwtGatewayFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(JwtGatewayFilter.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();
        String method = exchange.getRequest().getMethodValue();

        logger.debug("[JwtGatewayFilter] Processing request: {} {}", method, path);

        // Allow login/register without auth
        if (path.startsWith("/auth") && !path.startsWith("/auth/admin")) {
            logger.info("Allowing public auth endpoint: {}", path);
            logger.debug("[JwtGatewayFilter] Allowing auth endpoint: {}", path);
            return chain.filter(exchange);
        }

        // Handle admin routes - require ADMIN role
        if (path.startsWith("/admin") || path.startsWith("/auth/admin")) {
            logger.info("Processing admin route: {}", path);
            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("No Bearer token found for admin route: {}", path);
                logger.info("Denying admin route due to missing token: {}", path);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
            String token = authHeader.substring(7);
            try {
                Jws<Claims> claims = Jwts.parserBuilder()
                        .setSigningKey(jwtSecret.getBytes())
                        .build()
                        .parseClaimsJws(token);

                Object rolesObj = claims.getBody().get("roles");
                boolean isAdmin = false;
                if (rolesObj instanceof String roles) {
                    isAdmin = roles.contains("ROLE_ADMIN");
                    logger.debug("[JwtGatewayFilter] Admin check for roles string: {} - isAdmin: {}", roles, isAdmin);
                } else if (rolesObj instanceof Collection<?> rolesList) {
                    isAdmin = rolesList.contains("ROLE_ADMIN");
                    logger.debug("[JwtGatewayFilter] Admin check for roles collection: {} - isAdmin: {}", rolesList, isAdmin);
                }
                
                if (!isAdmin) {
                    logger.warn("Access denied - user does not have ADMIN role for path: {}", path);
                    logger.info("Denying admin route due to lack of ADMIN role: {}", path);
                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                    return exchange.getResponse().setComplete();
                }

                // Pass user info to downstream services
                exchange = exchange.mutate()
                        .request(builder -> builder
                                .header("X-User-Name", claims.getBody().getSubject())
                                .header("X-User-Roles", rolesObj != null ? rolesObj.toString() : "")
                        ).build();

                logger.info("Admin access granted for path: {}", path);

            } catch (JwtException e) {
                logger.error("JWT validation failed for admin route: {}", path, e);
                logger.info("Denying admin route due to JWT error: {}", path);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        }

        // Public GET endpoints for products
        if (path.matches("^/products($|/\\d+$|/category/.*|/search.*|/price-range.*|/category-price-range.*|/in-stock.*|/advanced-search.*)") && HttpMethod.GET.matches(method)) {
            logger.debug("[JwtGatewayFilter] Allowing public product GET: {}", path);
            return chain.filter(exchange);
        }

        // Allow order-specific stock update for authenticated users (not just ADMIN)
        if (path.matches("^/products/order/updateStockQuantity/\\d+$") && HttpMethod.PUT.matches(method)) {
            logger.debug("[JwtGatewayFilter] Processing order stock update route: {}", path);
            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("[JwtGatewayFilter] No Bearer token found for order stock update route: {}", path);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
            String token = authHeader.substring(7);
            try {
                Jws<Claims> claims = Jwts.parserBuilder()
                        .setSigningKey(jwtSecret.getBytes())
                        .build()
                        .parseClaimsJws(token);

                Object rolesObj = claims.getBody().get("roles");
                boolean isAuthenticated = false;
                if (rolesObj instanceof String roles) {
                    isAuthenticated = roles.contains("ROLE_USER") || roles.contains("ROLE_ADMIN");
                } else if (rolesObj instanceof Collection<?> rolesList) {
                    isAuthenticated = rolesList.contains("ROLE_USER") || rolesList.contains("ROLE_ADMIN");
                }
                
                if (!isAuthenticated) {
                    logger.warn("[JwtGatewayFilter] Access denied - user not authenticated for order stock update route: {}", path);
                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                    return exchange.getResponse().setComplete();
                }

                // Pass user info to downstream services
                exchange = exchange.mutate()
                        .request(builder -> builder
                                .header("X-User-Name", claims.getBody().getSubject())
                                .header("X-User-Roles", rolesObj != null ? rolesObj.toString() : "")
                        ).build();

                logger.debug("[JwtGatewayFilter] Order stock update access granted for path: {}", path);
                return chain.filter(exchange);

            } catch (JwtException e) {
                logger.error("[JwtGatewayFilter] JWT validation failed for order stock update route: {}", path, e);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        }

        // For all other /products endpoints, require ADMIN
        if (path.startsWith("/products")) {
            logger.debug("[JwtGatewayFilter] Processing product route: {}", path);
            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("[JwtGatewayFilter] No Bearer token found for product route: {}", path);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
            String token = authHeader.substring(7);
            try {
                Jws<Claims> claims = Jwts.parserBuilder()
                        .setSigningKey(jwtSecret.getBytes())
                        .build()
                        .parseClaimsJws(token);

                Object rolesObj = claims.getBody().get("roles");
                boolean isAdmin = false;
                if (rolesObj instanceof String roles) {
                    isAdmin = roles.contains("ROLE_ADMIN");
                } else if (rolesObj instanceof Collection<?> rolesList) {
                    isAdmin = rolesList.contains("ROLE_ADMIN");
                }
                
                if (!isAdmin) {
                    logger.warn("[JwtGatewayFilter] Access denied - user does not have ADMIN role for product route: {}", path);
                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                    return exchange.getResponse().setComplete();
                }

                // Pass user info to downstream services
                exchange = exchange.mutate()
                        .request(builder -> builder
                                .header("X-User-Name", claims.getBody().getSubject())
                                .header("X-User-Roles", rolesObj != null ? rolesObj.toString() : "")
                        ).build();

                logger.debug("[JwtGatewayFilter] Product access granted for path: {}", path);

            } catch (JwtException e) {
                logger.error("[JwtGatewayFilter] JWT validation failed for product route: {}", path, e);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        }

        // For all /cart endpoints, require USER or ADMIN
        if (path.startsWith("/cart")) {
            logger.debug("[JwtGatewayFilter] Processing cart route: {}", path);
            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("[JwtGatewayFilter] No Bearer token found for cart route: {}", path);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
            String token = authHeader.substring(7);
            try {
                Jws<Claims> claims = Jwts.parserBuilder()
                        .setSigningKey(jwtSecret.getBytes())
                        .build()
                        .parseClaimsJws(token);

                Object rolesObj = claims.getBody().get("roles");
                boolean isUser = false;
                if (rolesObj instanceof String roles) {
                    isUser = roles.contains("ROLE_USER") || roles.contains("ROLE_ADMIN");
                } else if (rolesObj instanceof Collection<?> rolesList) {
                    isUser = rolesList.contains("ROLE_USER") || rolesList.contains("ROLE_ADMIN");
                }
                if (!isUser) {
                    logger.warn("[JwtGatewayFilter] Access denied - user does not have USER or ADMIN role for cart route: {}", path);
                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                    return exchange.getResponse().setComplete();
                }

                // Pass user info to downstream services
                exchange = exchange.mutate()
                        .request(builder -> builder
                                .header("X-User-Name", claims.getBody().getSubject())
                                .header("X-User-Roles", rolesObj != null ? rolesObj.toString() : "")
                        ).build();

                logger.debug("[JwtGatewayFilter] Cart access granted for path: {}", path);

            } catch (JwtException e) {
                logger.error("[JwtGatewayFilter] JWT validation failed for cart route: {}", path, e);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        }

        // For all /order endpoints, require USER or ADMIN
        if (path.startsWith("/order")) {
            logger.debug("[JwtGatewayFilter] Processing order route: {}", path);
            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("[JwtGatewayFilter] No Bearer token found for order route: {}", path);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
            String token = authHeader.substring(7);
            try {
                Jws<Claims> claims = Jwts.parserBuilder()
                        .setSigningKey(jwtSecret.getBytes())
                        .build()
                        .parseClaimsJws(token);

                Object rolesObj = claims.getBody().get("roles");
                boolean isUser = false;
                if (rolesObj instanceof String roles) {
                    isUser = roles.contains("ROLE_USER") || roles.contains("ROLE_ADMIN");
                } else if (rolesObj instanceof Collection<?> rolesList) {
                    isUser = rolesList.contains("ROLE_USER") || rolesList.contains("ROLE_ADMIN");
                }
                if (!isUser) {
                    logger.warn("[JwtGatewayFilter] Access denied - user does not have USER or ADMIN role for order route: {}", path);
                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                    return exchange.getResponse().setComplete();
                }

                // Pass user info to downstream services
                exchange = exchange.mutate()
                        .request(builder -> builder
                                .header("X-User-Name", claims.getBody().getSubject())
                                .header("X-User-Roles", rolesObj != null ? rolesObj.toString() : "")
                        ).build();

                logger.debug("[JwtGatewayFilter] Order access granted for path: {}", path);

            } catch (JwtException e) {
                logger.error("[JwtGatewayFilter] JWT validation failed for order route: {}", path, e);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        }

        logger.debug("[JwtGatewayFilter] Request allowed to proceed: {} {}", method, path);
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1; // Ensure this runs early
    }
}