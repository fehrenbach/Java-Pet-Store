/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: FileUploadResponse.java,v 1.5 2006-05-05 20:15:24 inder Exp $ */

package com.sun.javaee.blueprints.petstore.model;

public class FileUploadResponse {
    
    private String itemId = null;
    private String productId = null;
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
    
    public FileUploadResponse(String itemId, String productId, String message, String status, String duration,
            String durationString, String startDate, String endDate, String uploadSize,
            String thumbnail) {
        this.itemId = itemId;
        this.productId = productId;
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
    public String getItemId() {
        return this.itemId;
    }
    public void setItemId(String str) {
        this.itemId = str;
    }
    public String getProductId() {
        return this.productId;
    }
    public void setProductId(String str) {
        this.productId = str;
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
    public String getStartDate() {
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
