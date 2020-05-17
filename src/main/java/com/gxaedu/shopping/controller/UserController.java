package com.gxaedu.shopping.controller;

import com.gxaedu.shopping.pojo.User;
import com.gxaedu.shopping.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author: yaya
 * @create: 2020/5/16
 */
@Controller
@ResponseBody
@RequestMapping("/user")
public class UserController {

    @Resource
    private UserService userService;

    @RequestMapping("/list")
    public List<User> getUsers(){
        return userService.getUsers();
    }
}
