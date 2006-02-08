/*
 * FileUploadBean.java
 *
 * Created on February 8, 2006, 9:07 AM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

package com.sun.javaee.blueprints.petstore.controller;

import java.util.HashMap;
import java.io.IOException;

import javax.faces.context.FacesContext;
import javax.faces.event.PhaseEvent;
import javax.servlet.http.HttpServletResponse;

import com.sun.javaee.blueprints.components.ui.fileupload.FileUploadStatus;
/**
 *
 * @author basler
 */
public class FileUploadBean {
    
    private boolean bDebug=false;
    
    /** Creates a new instance of FileUploadBean */
    public FileUploadBean() {
    }
    
    public void postProcessingMethod(PhaseEvent event, HashMap hmUpload, FileUploadStatus status) {
        if(bDebug) System.out.println("IN Custom Post Processing method");
        try {
            // set custom return enabled so Phaselistener knows not to send default response
            status.enableCustomReturn();
            FacesContext context=event.getFacesContext();
            HttpServletResponse response=(HttpServletResponse)context.getExternalContext().getResponse();
            StringBuffer sb=new StringBuffer();
            response.setContentType("text/xml;charset=UTF-8");
            response.setHeader("Cache-Control", "no-cache");
            sb.append("<response>");
            sb.append("<message>***CUSTOM SERVER-SIDE RETURN *** MESSAGE->");
            sb.append(status.getMessage());
            sb.append("</message>");
            sb.append("<status>");
            sb.append(status.getStatus());
            sb.append("</status>");
            sb.append("<duration>");
            sb.append(status.getUploadTime());
            sb.append("</duration>");
            sb.append("<duration_string>");
            sb.append(status.getUploadTimeString());
            sb.append("</duration_string>");
            sb.append("<start_date>");
            sb.append(status.getStartUploadDate());
            sb.append("</start_date>");
            sb.append("<end_date>");
            sb.append(status.getEndUploadDate());
            sb.append("</end_date>");
            sb.append("<upload_size>");
            sb.append(status.getTotalUploadSize());
            sb.append("</upload_size>");
            sb.append("</response>");
            if(bDebug) System.out.println("Response:\n" + sb);
            response.getWriter().write(sb.toString());
        } catch (IOException iox) {
            System.out.println("FileUploadPhaseListener error writting AJAX response : " + iox);
        }
    }
    
}
