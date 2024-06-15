package com.mainproject.server.auth.details;


import com.mainproject.server.constant.ErrorCode;
import com.mainproject.server.constant.UserStatus;
import com.mainproject.server.exception.ServiceLogicException;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserCustomDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        Optional<User> findUser = userRepository.findByEmail(userName);
        User user = findUser.orElseThrow(
                () -> new UsernameNotFoundException("Not Found Username")
        );
        if (user.getUserStatus().equals(UserStatus.INACTIVE)) {
            throw new ServiceLogicException(ErrorCode.USER_INACTIVE);
        }
        return new UserDetail(user);
    }

    private final class UserDetail extends User implements UserDetails {
        public UserDetail(User user) {
            setUserId(user.getUserId());
            setEmail(user.getEmail());
            setUserStatus(user.getUserStatus());
            setPassword(user.getPassword());
            setRoles(user.getRoles());
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return null;
        }

        @Override
        public String getUsername() {
            return getEmail();
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return true;
        }
    }

}
