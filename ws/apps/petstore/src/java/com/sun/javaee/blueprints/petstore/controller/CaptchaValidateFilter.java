/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: CaptchaValidateFilter.java,v 1.15 2006-09-28 23:20:39 basler Exp $ */

package com.sun.javaee.blueprints.petstore.controller;

import com.sun.javaee.blueprints.petstore.captcha.SimpleCaptcha;
import com.sun.javaee.blueprints.components.ui.fileupload.FileUploadStatus;
import java.io.IOException;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Hashtable;
import java.util.Date;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class CaptchaValidateFilter implements Filter {

    private static final boolean debug = false;
    private static final String CAPTCHA_FIELD_NAME = "j_captcha_response";
    private static final String INVALID_CAPTCHA = "captchaInvalid";
    
    // The filter configuration object we are associated with.  If
    // this value is null, this filter instance is not currently
    // configured.
    private FilterConfig filterConfig = null;
    
    public CaptchaValidateFilter() {
    }
    
    /**
     * @param request httpservlet request
     * @param response httpservlet response
     *
     * @return boolean true if captcha is correct
     */
    private Boolean isCaptchaCorrect(HttpServletRequest request, HttpServletResponse response) {
        
        String captchaString = null;
        // Using Cookie instead of actual form body
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(CAPTCHA_FIELD_NAME)) {
                captchaString = cookie.getValue();
            }
        }
        /* Multi part request
        ServletRequestContext src = new ServletRequestContext(request);
        
        if (ServletFileUpload.isMultipartContent(src)) {
            FileItemFactory factory = new DiskFileItemFactory();
            ServletFileUpload upload = new ServletFileUpload(factory);
            try {
                List<FileItem> itemList = upload.parseRequest(request);
                for (FileItem item : itemList) {
                    if (item.isFormField()) {
                        if (item.getFieldName().equals(CAPTCHA_FIELD_NAME)) {
                            captchaString = item.getString();
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            captchaString = request.getParameter(CAPTCHA_FIELD_NAME);
        }
         */
        Boolean validResponse = Boolean.FALSE;
        if (captchaString == null) {
            return validResponse;
        }
        try {
            SimpleCaptcha captcha = new SimpleCaptcha();
            validResponse = captcha.validateResponseWithSession(request.getSession(), captchaString);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return validResponse.booleanValue();
    }
    
    private String constructJsonEntry(String key, String value) {
        String dq = "\"";
        return (dq + key + dq + " : " + dq + value + dq);
    }
    
    /**
     *
     * @param request The servlet request we are processing
     * @param result The servlet response we are creating
     * @param chain The filter chain we are processing
     *
     * @exception IOException if an input/output error occurs
     * @exception ServletException if a servlet error occurs
     */
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {
        
        if (debug) log("CaptchaValidateFilter:doFilter()");
        
        Boolean correctCaptcha = isCaptchaCorrect((HttpServletRequest)request, (HttpServletResponse)response);
        
        Throwable problem = null;
        if (correctCaptcha) {
            // if there's previous set session attribute, remove it
            HttpSession session = ((HttpServletRequest)request).getSession(true);
            session.removeAttribute (INVALID_CAPTCHA);
            try {
                chain.doFilter(request, response);
            }
            catch(Throwable t) {
            //
            // If an exception is thrown somewhere down the filter chain,
            // we still want to execute our after processing, and then
            // rethrow the problem after that.
            //
              problem = t;
              t.printStackTrace();
            }
            
            // possible "after-do" process here
            
            //
            // If there was a problem, we want to rethrow it if it is
            // a known type, otherwise log it.
            //
            if (problem != null) {
                if (problem instanceof ServletException) throw (ServletException)problem;
                if (problem instanceof IOException) throw (IOException)problem;
                sendProcessingError(problem, response);
            }
        } else {
            /* As there's a dojo iframeIO bug for setting header, http response status,
             * it needs to set the "captcha invalid" status to the session attribute
             * for the next request
             */
            HttpSession session = ((HttpServletRequest)request).getSession(true);
            session.setAttribute(INVALID_CAPTCHA, new Boolean(true));
            FileUploadStatus fuStatus = new FileUploadStatus();
            session.setAttribute("fileUploadStatus", fuStatus);
            //fuStatus.setUploadItems(new Hashtable());
            //fuStatus.setEndUploadDate(new Date());
            String errorx="Captchas Filter Error";
            fuStatus.setMessage(errorx);
            fuStatus.setStatus(errorx);
            //RequestDispatcher rd = request.getRequestDispatcher("/captchaerror.jsp");
            //rd.forward(request, response);
            // assuming this is a xmlhttprequest
            /*
            response.setContentType("text/javascript");
            ((HttpServletResponse)response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            ((HttpServletResponse)response).setHeader("Cache-Control", "no-store");
            ((HttpServletResponse)response).setHeader("Pragma", "no-cache");
            
            PrintWriter out = response.getWriter();
            out.println("{");
            out.println(constructJsonEntry("message", "Please enter the correct captcha string"));
            out.println("}");
            out.flush();
            out.close();
            */
            response.setContentType("text/plain");
            ((HttpServletResponse)response).setHeader("Cache-Control", "no-store");
            ((HttpServletResponse)response).setHeader("Pragma", "no-cache");
        }
    }
    
    /**
     * Return the filter configuration object for this filter.
     */
    public FilterConfig getFilterConfig() {
        return (this.filterConfig);
    }
    
    /**
     * Set the filter configuration object for this filter.
     *
     * @param filterConfig The filter configuration object
     */
    public void setFilterConfig(FilterConfig filterConfig) {
        
        this.filterConfig = filterConfig;
    }
    
    /**
     * Destroy method for this filter
     *
     */
    public void destroy() {
    }
    
    /**
     * Init method for this filter
     *
     */
    public void init(FilterConfig filterConfig) {
        
        this.filterConfig = filterConfig;
        if (filterConfig != null) {
            if (debug) {
                log("CaptchaValidateFilter:Initializing filter");
            }
        }
    }
    
    /**
     * Return a String representation of this object.
     */
    public String toString() {
        
        if (filterConfig == null) return ("CaptchaValidateFilter()");
        StringBuffer sb = new StringBuffer("CaptchaValidateFilter(");
        sb.append(filterConfig);
        sb.append(")");
        return (sb.toString());
        
    }
    
    private void sendProcessingError(Throwable t, ServletResponse response) {
        
        String stackTrace = getStackTrace(t);
        
        if(stackTrace != null && !stackTrace.equals("")) {
            
            try {
                
                response.setContentType("text/html");
                PrintStream ps = new PrintStream(response.getOutputStream());
                PrintWriter pw = new PrintWriter(ps);
                pw.print("<html>\n<head>\n<title>Error</title>\n</head>\n<body>\n"); //NOI18N
                
                // PENDING! Localize this for next official release
                pw.print("<h1>The resource did not process correctly</h1>\n<pre>\n");
                pw.print(stackTrace);
                pw.print("</pre></body>\n</html>"); //NOI18N
                pw.close();
                ps.close();
                response.getOutputStream().close();;
            }
            
            catch(Exception ex){ }
        } else {
            try {
                PrintStream ps = new PrintStream(response.getOutputStream());
                t.printStackTrace(ps);
                ps.close();
                response.getOutputStream().close();;
            } catch(Exception ex){ }
}
    }
    
    public static String getStackTrace(Throwable t) {
        
        String stackTrace = null;
        
        try {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            t.printStackTrace(pw);
            pw.close();
            sw.close();
            stackTrace = sw.getBuffer().toString();
        } catch(Exception ex) {}
        return stackTrace;
    }
    
    public void log(String msg) {
        filterConfig.getServletContext().log(msg);
    }
}
