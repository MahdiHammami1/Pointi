package com.example.demo.controllers ;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    @RequestMapping(value = { "/", "/{x:[\\w\\-]+}", "/**/{x:[\\w\\-]+}" })
    public String redirectToIndex() {
        return "forward:/index.html";
    }
}
