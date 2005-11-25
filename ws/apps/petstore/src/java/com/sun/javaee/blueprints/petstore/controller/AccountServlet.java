package com.sun.javaee.blueprints.petstore.controller;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;


public class AccountServlet extends HttpServlet {
    
    private ServletContext context;
    private HashMap accounts;

    public void init(ServletConfig config) {
        System.out.println("AccountServlet: initializing...");
        context = config.getServletContext();
    }


   
    public void doGet(HttpServletRequest request, HttpServletResponse  response)
        throws IOException, ServletException {
        doProcess(request, response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse  response)
        throws IOException, ServletException {
        doProcess(request, response);
        
    }
    
    private void doProcess(HttpServletRequest request, HttpServletResponse response)
                   throws IOException, ServletException {
        request.setCharacterEncoding("UTF-8");
        try {
            String action = request.getParameter("action");
             System.out.println("AccountServlet: action=" + action);
            // negotiate a userid
            if ("signin".equals(action)) {
                String userId = request.getParameter("userId").trim();
                String password = request.getParameter("password").trim();
                System.out.println("AccountServlet: userId " + userId);
                System.out.println("AccountServlet: password " + password);
                // content-type must be set to text/xml with UTF-8 support
                response.setContentType("text/xml;charset=utf-8");
                // needed to keep some browsers from using locally cached data

                response.setHeader("Cache-Control", "no-cache");
                PrintWriter pw = response.getWriter();
                response.setContentType("text/xml;charset=utf-8");
                if ("gmurray".equals(userId) && "foo".equals(password)) {
                    pw.write("<message>valid</message>");
                    System.out.println("*** AccountServlet: valid " + userId);
                } else {
                    pw.write("<message>invalid</message>");
                    System.out.println("*** AccountServlet: invalid " + userId);
                }
                pw.flush(); 
            }
        } catch (Throwable e) {
            System.out.println("AccountServlet error:" + e);
        }
    }
    
    public void destroy(){
    }
    
}

