package com.sun.javaee.blueprints.petstore.controller;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;


public class ChatServlet extends HttpServlet implements Runnable {
    
    private ServletContext context;
    private Thread timer;
    
    private int counter;
    private HashMap users;
    private ArrayList messages;
       
    public void init(ServletConfig config) {
        System.out.println("ChatServlet: initializing...");
        users = new HashMap();
        messages = new ArrayList();
        timer = new Thread(this);
        timer.setPriority(Thread.MIN_PRIORITY);
        timer.start();
    }

    public void run() {
        while (true) {
            try {
                timer.sleep(5000);
             } catch (InterruptedException ie) {
             }
             counter++;
        }
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
             System.out.println("ChatServlet: action=" + action);
            // negotiate a userid
            if ("valid-register".equals(action)) {
                String userId = request.getParameter("userid").trim();
                System.out.println("ChatServlet: validating " + userId);
                // content-type must be set to text/xml
                response.setContentType("text/xml");
                // needed to keep some browsers from using locally cached data
                response.setHeader("Cache-Control", "no-cache");
                PrintWriter pw = response.getWriter();
                if (users.containsKey(userId)) {
                    pw.write("<message>invalid</message>");
                    System.out.println("ChatServlet: invalid " + userId);
                } else {
                    pw.write("<message>valid</message>");
                    System.out.println("ChatServlet: valid " + userId);
                }
                pw.flush(); 
            } else if ("register".equals(action)) {
                String userId = request.getParameter("userid").trim();
                String iconURI = request.getParameter("icon");
                // content-type must be set to text/xml
                response.setContentType("text/xml");
                // needed to keep some browsers from using locally cached data
                response.setHeader("Cache-Control", "no-cache");
                PrintWriter pw = response.getWriter();
                if (users.containsKey(userId)) {
                    pw.write("<message>invalid</message>");
                    System.out.println("ChatServlet invalid user:" + userId);
                } else {
                    // add the selected icon id later
                    System.out.println("ChatServlet adding user:" + userId);
                    users.put(userId, new Chatter(userId,iconURI));
                    pw.write("<message>valid</message>");
                }
            } else if ("add-message".equals(action)) {
                String userId = request.getParameter("userid");
                if (userId != null) userId = userId.trim();
                String message = request.getParameter("message");
                
                System.out.println("ChatServer:add-message userId=" + userId + " message=" + message);
                // content-type must be set to text/xml
                response.setContentType("text/xml;charset=utf-8");
                
                // needed to keep some browsers from using locally cached data
                response.setHeader("Cache-Control", "no-cache");
                PrintWriter pw = response.getWriter();
                if (users.containsKey(userId)) {
                	   messages.add(new Message(userId, message));
                    pw.write("<message>valid</message>");
                } else {
                    pw.write("<message>invalid user</message>");
                }                
                pw.flush();
            } else if ("get-messages".equals(action)) {
                String userId = request.getParameter("userid");
                if (userId != null) userId = userId.trim();
                String indexString = request.getParameter("index");
                int index = 0;
                try {
                	index = Integer.parseInt(indexString);
                } catch (Exception e) {
                	   System.err.println("ChatServlet error parsing index: " + e);
                    // default to the 0 if there was no index
                }
                
                System.out.println("ChatServer:get-messages userId=" + userId + " index=" + index);
                // content-type must be set to text/xml
                response.setContentType("text/xml;charset=utf-8");
                
                // needed to keep some browsers from using locally cached data
                response.setHeader("Cache-Control", "no-cache");
                PrintWriter pw = response.getWriter();
                if (users.containsKey(userId) && index < messages.size()) {
                    pw.write("<messages>");
                    for (int loop=index; loop < messages.size(); loop++) {
                    	  Message m = (Message)messages.get(loop);
                    	  pw.write("<message>");
                    	  pw.write(" <text>" + m.getMessage() + "</text>");   	
                    	  pw.write(" <sender>" + m.getSender() + "</sender>");
                    	  pw.write("</message>");
                    }
                    pw.write("</messages>");
                } else {
                    response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                }
                pw.flush();
            }
        } catch (Throwable e) {
            System.out.println("ChatServlet error:" + e);
        }
    }
    
    public void destroy(){
        timer.destroy();
    }
    
    class Chatter {
        
      private String id;
      private String icon;
      
      public Chatter(String id, String icon) {
          this.id = id;
          this.icon = icon;
      }
      
      public String getId() {
          return id;	
      }
      
      public String getIconURI() {
          return icon;	
      }
    }
    
    class Message {
        
      private String sender;
      private String message;
      
      public Message(String sender, String message) {
          this.sender = sender;
          this.message = message;
      }
      
      public String getMessage(){
          return message;	
      }
      
      public String getSender(){
        return sender;
      }
    }
    
}

