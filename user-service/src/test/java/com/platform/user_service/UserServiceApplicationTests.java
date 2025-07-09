package com.platform.user_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import com.platform.service.UserService;
import com.platform.dto.AuthRequest;
import com.platform.model.User;
import com.platform.repository.UserRepository;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.platform.controller.AdminUserController;
import com.platform.controller.AuthController;
import com.platform.repository.UserRepository;
import com.platform.service.UserService;
import com.platform.dto.UserDTO;
import com.platform.model.User;
import com.platform.dto.AuthRequest;
import com.platform.dto.LoginRequest;
import com.platform.dto.AuthResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class UserServiceApplicationTests {
    @Mock
    private UserRepository userRepository;
    @Mock
    private UserService userService;
    @InjectMocks
    private AdminUserController adminUserController;
    @InjectMocks
    private AuthController authController;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void contextLoads() {}
    @Test
    void testGetAllUsersReturnsList() {
        List<User> users = Arrays.asList(new User(), new User());
        when(userRepository.findAll()).thenReturn(users);
        List<User> result = adminUserController.getAllUsers();
        assertEquals(2, result.size());
    }
    @Test
    void testGetUserByIdReturnsUser() {
        User user = new User();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        Optional<User> result = adminUserController.getUserById(1L);
        assertTrue(result.isPresent());
        assertEquals(user, result.get());
    }
    @Test
    void testRegisterDelegatesToService() {
        AuthRequest req = new AuthRequest();
        when(userService.register(req)).thenReturn("Registered");
        String result = authController.register(req);
        assertEquals("Registered", result);
    }
    @Test
    void testGetProfileDelegatesToService() {
        UserDTO dto = new UserDTO();
        when(userService.getProfile("user1")).thenReturn(dto);
        UserDTO result = authController.getProfile("user1");
        assertEquals(dto, result);
    }
}
