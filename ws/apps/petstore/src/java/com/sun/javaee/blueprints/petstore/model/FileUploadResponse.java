/* Copyright 2005 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: FileUploadResponse.java,v 1.1 2006-04-28 01:14:38 yutayoshida Exp $ */

package com.sun.javaee.blueprints.petstore.model;

import com.sun.javaee.blueprints.components.ui.fileupload.FileUploadStatus;

public class FileUploadResponse {
    
    private String message = null;
    private String status = null;
    private String duration = null;
    private String durationString = null;
    private String startDate = null;
    private String endDate = null;
    private String uploadSize = null;
    private String thumbnail = null;
    
    /** Creates a new instance of FileUploadResponse */
    public FileUploadResponse() {
    }
    
    public FileUploadResponse(String message, String status, String duration,
            String durationString, String startDate, String endDate, String uploadSize,
            String thumbnail) {
        this.message = message;
        this.duration = duration;
        this.durationString = durationString;
        this.startDate = startDate;
        this.endDate = endDate;
        this.uploadSize = uploadSize;
        this.thumbnail = thumbnail;
    }
    
    /* get/set
     * message, status, duration, duration_string, start_date, end_date, upload_size, thumbnail
     */
    
    public String getMessage() {
        return this.message;
    }
    public void setMessage(String str) {
        this.message = str;
    }
    public String getStatus() {
        return this.status;
    }
    public void setStatus(String str) {
        this.status = str;
    }
    public String getDuration() {
        return this.duration;
    }
    public void setDuration(String str) {
        this.duration = str;
    }
    public String getDurationString() {
        return this.durationString;
    }
    public void setDurationString(String str) {
        this.durationString = str;
    }
    public String getstartDate() {
        return this.startDate;
    }
    public void setStartDate(String str) {
        this.startDate = str;
    }
    public String getEndDate() {
        return this.endDate;
    }
    public void setEndDate(String str) {
        this.endDate = str;
    }
    public String getUploadSize() {
        return this.uploadSize;
    }
    public void setUploadSize(String str) {
        this.uploadSize = str;
    }
    public String getThumbnail() {
        return this.thumbnail;
    }
    public void setThumbnail(String str) {
        this.thumbnail = str;
    }
    
}
