/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html  
$Id: CheckoutServlet.java,v 1.1 2005-11-10 12:06:34 gmurray71 Exp $ */

package com.sun.javaee.blueprints.petstore.controller;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;


public class CheckoutServlet extends HttpServlet implements Runnable {
    
    private ServletContext context;
    private Thread timer;
    private String message;
    private int counter;
    private int taskCounter;
    private HashMap tasks;
   
    
    public void init(ServletConfig config) {
        System.out.println("CheckoutServlet: initializing...");
        tasks = new HashMap();
        timer = new Thread(this);
        timer.setPriority(Thread.MIN_PRIORITY);
        timer.start();
    }

    public void run() {
        while (true) {
            try {
                timer.sleep(2000);
             } catch (InterruptedException ie) {
             }
             counter++;
        }
    }
   
    public  void doGet(HttpServletRequest request, HttpServletResponse  response)
        throws IOException, ServletException {
        doProcess(request, response);
    }

    public  void doPost(HttpServletRequest request, HttpServletResponse  response)
        throws IOException, ServletException {
        doProcess(request, response);
        
    }
    
    private void doProcess(HttpServletRequest request, HttpServletResponse response)
                   throws IOException, ServletException {
        
        try {
            String targetId = request.getParameter("targetId");
            String messageHash = request.getParameter("messageHash");
            String action = request.getParameter("action");
            System.out.println("TaskMaster: action=" + action);
            // start a new task
            if ((action != null) && action.equals("startTask")) {
                // this task will take 20 cycles of the counter to complete
                System.out.println("Checkout: starting new Checkout targetId=" + targetId + " start=" + counter);
                Task t = new Task(counter, 5);
                taskCounter++;
                tasks.put(taskCounter + "", t);
                // return intial content
                response.setContentType("text/xml");
                response.setHeader("Cache-Control", "no-cache");
                PrintWriter pw = response.getWriter();
                pw.write("<message>" + taskCounter + "</message>");
                pw.flush();
            } else {
                int percentage = 0;
                if (tasks.get(targetId) != null) {
                    percentage = ((Task)tasks.get(targetId)).getPrecentComplete(counter);
                }
                if ((messageHash !=null) &&
                        (Integer.valueOf(messageHash).intValue()) == percentage) {
                    // nothing has changed
                    response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                } else {
                    response.setContentType("text/xml");
                    response.setHeader("Cache-Control", "no-cache");
                    PrintWriter pw = response.getWriter();
                    if (percentage > 100) percentage = 100;
                    pw.write("<message>" + percentage +  "</message>");
                    pw.flush();
                }
            }
        } catch (Throwable e) {
            System.out.println("TaskMaster error:" + e);
        }
    }
    
    public void destroy(){
        timer.destroy();
    }
    
    class Task {
        
      private int start;
      private int length;
      
      public Task(int start, int length) {
          this.start = start;
          this.length = length;
      }
      
      public int getPrecentComplete(int counter){
          return (int)(100 * ((double)(counter - start) / (double)length));
      }
      
    
    }
    
}

