/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
 
$Id: ImageServlet.java,v 1.4 2006-05-05 01:49:41 basler Exp $ */
package com.sun.javaee.blueprints.petstore.controller;

import com.sun.javaee.blueprints.petstore.util.PetstoreConstants;
import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;
import java.io.BufferedInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author basler
 * @version
 */
public class ImageServlet extends HttpServlet {
    
    public static final String GIF_SUFFIX = ".gif";
    public static final String JPG_SUFFIX = ".jpg";
    public static final String PNG_SUFFIX = ".png";
    private static final boolean bDebug=false;
    private Logger _logger=null;
    
    /** Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if(bDebug) System.out.println(" pathinfo " + request.getPathInfo());
        String pathInfo=request.getPathInfo();
        
        // set proper contentType
        if (pathInfo.endsWith(GIF_SUFFIX)) {
            response.setContentType("image/gif");
        } else if (pathInfo.endsWith(JPG_SUFFIX)) {
            response.setContentType("image/jpeg");
        } else if (pathInfo.endsWith(PNG_SUFFIX)) {
            response.setContentType("image/x-png");
        }
        
        
        // look for file in default location
        String imagePath=getServletContext().getRealPath(pathInfo);
        if(bDebug) System.out.println("Image path = " + imagePath);
        File imageFile=new File(imagePath);
        if(!imageFile.exists()) {
            
            // not in default location, look in upload location
            imageFile=new File(PetstoreConstants.PETSTORE_IMAGE_DIRECTORY + pathInfo);
            if(bDebug) System.out.println("Image alter path = " + PetstoreConstants.PETSTORE_IMAGE_DIRECTORY + pathInfo);
            if(!imageFile.exists()) {
                getLogger().log(Level.SEVERE, "image_does_not_exist", PetstoreConstants.PETSTORE_IMAGE_DIRECTORY + pathInfo);
                return;
            }
        }
        
        DataOutputStream outData=null;
        BufferedInputStream inData=null;
        int byteCnt=0;
        byte[] buffer=new byte[4096];
        
        // serve up image from proper location
        try {
            outData=new DataOutputStream(response.getOutputStream());
            inData=new BufferedInputStream(new FileInputStream(imageFile));
            
            // loop through and read/write bytes
            while ((byteCnt=inData.read(buffer)) != -1) {
                if (outData != null && byteCnt > 0) {
                    outData.write(buffer, 0, byteCnt);
                }
            }
            
        } catch (IOException e) {
            throw e;
        } finally {
            try {
                if(inData != null) {
                    inData.close();
                }
            } catch (IOException ioe) {}
        }
        outData.close();
    }
    
    /**
     * Method getLogger
     *
     * @return Logger - logger for the NodeAgent
     */
    public Logger getLogger() {
        if (_logger == null) {
            _logger=PetstoreUtil.getBaseLogger();
        }
        return _logger;
    }
    
    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    
    /** Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     *
     * @param response servlet response
     *
     */
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    
    throws ServletException, IOException {
        
        processRequest(request, response);
        
    }
    
    
    
    /** Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     *
     * @param response servlet response
     *
     */
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    
    throws ServletException, IOException {
        
        processRequest(request, response);
        
    }
    
    
    
    /** Returns a short description of the servlet.
     *
     */
    
    public String getServletInfo() {
        
        return "Short description";
        
    }
    
    // </editor-fold>
    
}

