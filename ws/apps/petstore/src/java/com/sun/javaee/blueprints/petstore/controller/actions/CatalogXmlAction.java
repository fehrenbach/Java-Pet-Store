/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: CatalogXmlAction.java,v 1.5 2007-04-30 21:04:29 basler Exp $ */

package com.sun.javaee.blueprints.petstore.controller.actions;

import com.sun.javaee.blueprints.petstore.controller.ControllerAction;
import com.sun.javaee.blueprints.petstore.model.CatalogFacade;
import com.sun.javaee.blueprints.petstore.model.Category;
import com.sun.javaee.blueprints.petstore.model.Item;
import com.sun.javaee.blueprints.petstore.model.Product;
import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;
import java.io.IOException;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This action class serves up XML data for catalog.
 * @author Greg Murray
 * @author Mark Basler
 * @author Inderjeet Singh
 */
public class CatalogXmlAction implements ControllerAction {
    
    private final CatalogFacade cf;
    private static final boolean bDebug=false;
    private static final String COMMA =", ";
    private static final String DOUBLE_QUOTE = "\"";

    public CatalogXmlAction(CatalogFacade cf) {
        this.cf = cf;
    }
    public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException  {
        request.setCharacterEncoding("UTF-8");
        String command = request.getParameter("command");
        String format = request.getParameter("format");
        String callback = request.getParameter("callback");

        if ("category".equals(command)) {
            String catid = request.getParameter("catid");
            if(bDebug) System.out.println("Request for category with id: " + catid);
            // set content-type header before accessing the Writer
            response.setContentType("text/xml;charset=UTF-8");
            String str = handleCategory(catid);
            response.getWriter().println(str);

        } else if ("items".equals(command)) {
            String pid = request.getParameter("pid");
            String startString = request.getParameter("start");
            int start = 0;
            if (startString != null) {
                try {
                    start = Integer.parseInt(startString);
                } catch (NumberFormatException nfe) {
                    // defaults start to 0
                }
            }
            String lengthString = request.getParameter("length");
            int length = 10;
            if (lengthString != null) {
                try {
                    length = Integer.parseInt(lengthString);
                } catch (NumberFormatException nfe) {
                    // defaults length to 10
                }
            }
            String baseURL = "http://" + request.getServerName() + ":" + request.getServerPort() + "/" + request.getContextPath() + "/ImageServlet/";
            List<Item> items = cf.getItemsVLH(pid, start, length);
            //get response data
            String str = handleItems(response, items, baseURL, format, callback);
            response.getWriter().println(str);

        } else if ("itemInChunk".equals(command)) {
            String pid = request.getParameter("pid");
            String itemId = request.getParameter("itemId");
            int start = 0;
            String lengthString = request.getParameter("length");
            int length = 10;
            if (lengthString != null) {
                try {
                    length = Integer.parseInt(lengthString);
                } catch (NumberFormatException nfe) {
                    // defaults length to 10
                }
            }
            // set content-type header before accessing the Writer
            response.setContentType("text/xml;charset=UTF-8");
            // leave these headers here for development - remove for deploy
            response.setHeader("Cache-Control", "no-cache");
            response.setHeader("Pragma", "no-cache");
            String baseURL = "http://" + request.getServerName() + ":" + request.getServerPort() + "/" + request.getContextPath() + "/ImageServlet/";
            List<Item> items = cf.getItemInChunkVLH(pid, itemId, length);
            //get response data
            if (items != null) {
                String str = handleItems(response, items, baseURL, format, callback);
                response.getWriter().println(str);
            } else {
                response.getWriter().println("<items></items>");
            }

        } else if ("categories".equals(command)) {
            if(bDebug) System.out.println("Request for categories.");
            // get response data in proper format
            response.getWriter().println(handleCategories(response, format, callback));

        } else if ("item".equals(command)) {
            String targetId = request.getParameter("id");
            if(bDebug) System.out.println("CatalogServlet: Request for item with id: " + targetId);
            String str = handleItem(targetId);
            response.setContentType("text/xml;charset=UTF-8");
            response.getWriter().println(str);

        } else if("disable".equals(command)) {
            String targetId=request.getParameter("id");
            Item i=cf.getItem(targetId);
            // disable and persist item
            i.setDisabled(1);
            cf.updateItem(i);
            handleItem(targetId);
        }
    }


    private String handleItems(HttpServletResponse response, List<Item> items, String baseURL, String format, String callback) {
        StringBuffer sb = new StringBuffer();

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Pragma", "no-cache");

        // then write the data of the response
        if(format != null && (format.toLowerCase().equals("json") || format.toLowerCase().equals("jsonp"))) {
            // set content-type header before accessing the Writer
            response.setContentType("text/javascript;charset=UTF-8");
            // if jsonp, set call back
            if(format.toLowerCase().equals("jsonp")) {
                String functionName="bpui.petstoreList.populateData";
                if(callback != null && callback.length() > 0) {
                    functionName=callback;
                }
                sb.append(functionName + "(eval('");
            }

            sb.append("[");
            for (Item i : items) {
                sb.append("{");
                sb.append("\"productID\":\"");
                sb.append(PetstoreUtil.encodeJSONString(i.getProductID()));
                sb.append(DOUBLE_QUOTE);
                sb.append(COMMA);

                sb.append("\"itemID\":\"");
                sb.append(PetstoreUtil.encodeJSONString(i.getItemID()));
                sb.append(DOUBLE_QUOTE);
                sb.append(COMMA);

                sb.append("\"name\":\"");
                sb.append(PetstoreUtil.encodeJSONString(i.getName()));
                sb.append(DOUBLE_QUOTE);
                sb.append(COMMA);

                sb.append("\"description\":\"");
                sb.append(PetstoreUtil.encodeJSONString(i.getDescription()));
                sb.append(DOUBLE_QUOTE);
                sb.append(COMMA);

                sb.append("\"price\":\"");
                sb.append(PetstoreUtil.encodeJSONString(String.valueOf(i.getPrice())));
                sb.append(DOUBLE_QUOTE);
                sb.append(COMMA);

                sb.append("\"imageThumbURL\":\"");
                sb.append(PetstoreUtil.encodeJSONString(i.getImageThumbURL()));
                sb.append(DOUBLE_QUOTE);
                sb.append(COMMA);


                sb.append("\"imageURL\":\"");
                sb.append(PetstoreUtil.encodeJSONString(i.getImageURL()));
                sb.append(DOUBLE_QUOTE);
                sb.append("}");
                sb.append(COMMA);
            }

            if(items.size() > 0) {
                sb.deleteCharAt(sb.length()-1);//remove last space
                sb.deleteCharAt(sb.length()-1);//remove last comma
            }

            sb.append("]");

            // if jsonp, set call back
            if(format.toLowerCase().equals("jsonp")) {
                sb.append("'))");
            }

        } else {
            // set content-type header before accessing the Writer
            response.setContentType("text/xml;charset=UTF-8");

            sb.append("<items>\n");
            if(bDebug) System.out.println("**** Items length=" + items.size());
            for (Item i : items) {
                sb.append("<item>\n");
                sb.append(" <id>" + i.getItemID() + "</id>\n");
                sb.append(" <product-id>" + i.getProductID() + "</product-id>\n");
                sb.append(" <rating>" + i.checkAverageRating() + "</rating>\n");
                sb.append(" <name>" + i.getName() + "</name>\n");
                sb.append(" <description><![CDATA[" + i.getDescription() + "]]></description>\n");
                sb.append(" <price>" + NumberFormat.getCurrencyInstance(Locale.US).format(i.getPrice()) + "</price>\n");
                sb.append(" <image-url>" + baseURL + i.getImageURL() + "</image-url>\n");
                sb.append(" <image-tb-url>" + baseURL + i.getImageThumbURL() + "</image-tb-url>\n");
                sb.append("</item>\n");
            }
            sb.append("</items>");
        }
        return sb.toString();
    }
    
    private String handleCategory(String categoryId) {
        StringBuffer sb = new StringBuffer();
        // then write the data of the response
        sb.append("<category>\n");
        sb.append("<cat-id>" + categoryId + "</cat-id>\n");
        sb.append("<cat-name>" + cf.getCategory(categoryId).getName()  + "</cat-name>\n");
        sb.append("<items>\n");
        for (Item i : cf.getAllItemsFromCategory(categoryId)) {
            sb.append("<item>\n");
            sb.append(" <id>" + i.getItemID() + "</id>\n");
            sb.append(" <prod-id>" + i.getProductID() + "</prod-id>\n");
            sb.append(" <cat-id>" + categoryId + "</cat-id>\n");
            sb.append(" <name>" + i.getName() + "</name>\n");
            sb.append(" <price>" + NumberFormat.getCurrencyInstance(Locale.US).format(i.getPrice()) + "</price>\n");
            sb.append(" <description><![CDATA[" + i.getDescription() + "]]></description>\n");
            sb.append(" <image-url>" + i.getImageURL() + "</image-url>\n");
            sb.append("</item>\n");
        }
        sb.append("</items>");
        sb.append("</category>\n");
        return sb.toString();
    }
    
    private String handleItem(String targetId){
        Item i = cf.getItem(targetId);
        StringBuffer sb = new StringBuffer();
        sb.append("<item>\n");
        sb.append(" <id>" + i.getItemID() + "</id>\n");
        sb.append(" <cat-id>" + i.getProductID() + "</cat-id>\n");
        sb.append(" <name>" + i.getName() + "</name>\n");
        sb.append(" <description><![CDATA[" + i.getDescription() + "]]></description>\n");
        sb.append(" <image-url>" + i.getImageURL() + "</image-url>\n");
        sb.append(" <price>" + NumberFormat.getCurrencyInstance(Locale.US).format(i.getPrice())  + "</price>\n");
        sb.append("</item>\n");
        return sb.toString();
    }
    
    private String handleCategories(HttpServletResponse response, String format, String callback){
        StringBuilder sb = new StringBuilder();

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Pragma", "no-cache");

        if (format != null && (format.toLowerCase().equals("json") ||  format.toLowerCase().equals("jsonp"))) {
            response.setContentType("text/javascript;charset=UTF-8");

            // if jsonp, set call back
            if(format.toLowerCase().equals("jsonp")) {
                String functionName="bpui.petstoreList.populateCategory";
                if(callback != null && callback.length() > 0) {
                    functionName=callback;
                }
                sb.append(functionName + "(eval('");
            }

            sb.append("[");
            boolean first = true;
            for (Category c : cf.getCategories()) {
                if (first) {
                    first = false;
                } else {
                    sb.append(",");
                }
                String catid = c.getCategoryID() + "";
                sb.append("{");
                sb.append("\"id\":\"" + PetstoreUtil.encodeJSONString(c.getCategoryID()) + "\",");
                sb.append("\"catid\":\"" + PetstoreUtil.encodeJSONString(catid) + "\",");
                sb.append("\"name\":\"" + PetstoreUtil.encodeJSONString(c.getName()) + "\",");
                sb.append("\"description\":\"" + PetstoreUtil.encodeJSONString(c.getDescription()) + "\",");
                sb.append("\"imageURL\":\"" + PetstoreUtil.encodeJSONString(c.getImageURL()) + "\",");
                sb.append("\"products\": [");
                // get the products in that category
                boolean first1 = true;
                for (Product p : cf.getProducts(catid)) {
                    if (first1) {
                        first1 = false;
                    } else {
                        sb.append(",");
                    }
                    sb.append("{");
                    sb.append("\"id\":\"" + PetstoreUtil.encodeJSONString(p.getProductID()) + "\",");
                    sb.append("\"catid\":\"" + PetstoreUtil.encodeJSONString(catid) + "\",");
                    sb.append("\"name\":\"" + PetstoreUtil.encodeJSONString(p.getName()) + "\",");
                    sb.append("\"description\":\"" + (p.getDescription()) + "\",");
                    sb.append("\"imageURL\":\"" + PetstoreUtil.encodeJSONString(p.getImageURL()) + "\"");
                    sb.append("}");
                }
                sb.append("]");
                sb.append("}");
            }
            sb.append("]");

            // if jsonp, set call back
            if(format.toLowerCase().equals("jsonp")) {
                sb.append("'))");
            }
        } else {
            response.setContentType("text/xml;charset=UTF-8");

            sb.append("<categories>\n");
            for (Category c : cf.getCategories()) {
                sb.append("<category>\n");
                sb.append(" <id>" + c.getCategoryID() + "</id>\n");
                sb.append(" <cat-id>" + c.getCategoryID()+ "</cat-id>\n");
                sb.append(" <name>" + c.getName() + "</name>\n");
                sb.append(" <description><![CDATA[" +c.getDescription() + "]]></description>\n");
                sb.append(" <image-url>" + c.getImageURL() + "</image-url>\n");
                sb.append("</category>\n");
            }
            sb.append("</categories>\n");
        }
        return sb.toString();
    }
}
