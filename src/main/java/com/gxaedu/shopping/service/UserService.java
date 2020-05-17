package com.gxaedu.shopping.service;

import com.gxaedu.shopping.mapper.UserMapper;
import com.gxaedu.shopping.pojo.User;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author: yaya
 * @create: 2020/5/16
 */
@Service
public class UserService {
    @Resource
    private UserMapper userMapper;

    public List<User> getUsers(){
        return userMapper.getUsers();
    }
}
