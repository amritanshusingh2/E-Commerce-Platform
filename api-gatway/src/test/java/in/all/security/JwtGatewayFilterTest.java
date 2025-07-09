package in.all.security;

import in.all.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import org.springframework.http.server.RequestPath;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpRequest;

class JwtGatewayFilterTest {
    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void publicAuthEndpoint_allowsRequest() {
        JwtGatewayFilter filter = new JwtGatewayFilter();
        ServerWebExchange exchange = mock(ServerWebExchange.class);
        ServerHttpRequest request = mock(ServerHttpRequest.class);
        RequestPath path = mock(RequestPath.class);
        when(exchange.getRequest()).thenReturn(request);
        when(request.getPath()).thenReturn(path);
        when(path.toString()).thenReturn("/auth/login");
        when(request.getMethodValue()).thenReturn("POST");
        GatewayFilterChain chain = mock(GatewayFilterChain.class);
        when(chain.filter(exchange)).thenReturn(Mono.empty());
        filter.filter(exchange, chain).block();
        verify(chain, times(1)).filter(exchange);
    }
    @Test
    void testHandleGenericExceptionReturnsInternalServerError() {
        Exception ex = new Exception("Something went wrong");
        Mono<ResponseEntity<Map<String, Object>>> mono = globalExceptionHandler.handleGenericException(ex);
        ResponseEntity<Map<String, Object>> response = mono.block();
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
        assertEquals("Internal Server Error", response.getBody().get("error"));
        assertTrue(response.getBody().get("message").toString().contains("Something went wrong"));
    }
} 