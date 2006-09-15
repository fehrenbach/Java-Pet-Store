/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: ControllerServlet.java,v 1.10 2006-09-15 21:34:52 yutayoshida Exp $ */

package com.sun.javaee.blueprints.petstore.controller;

import com.sun.javaee.blueprints.petstore.captcha.SimpleCaptcha;
import com.sun.javaee.blueprints.petstore.model.CatalogFacade;
import com.sun.javaee.blueprints.petstore.model.Category;
import com.sun.javaee.blueprints.petstore.model.FileUploadResponse;
import com.sun.javaee.blueprints.petstore.model.Item;
import com.sun.javaee.blueprints.petstore.model.Product;
import com.sun.javaee.blueprints.petstore.util.PetstoreConstants;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.logging.Logger;
import java.util.logging.Level;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Iterator;
import java.util.List;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpSession;


/**
 * This servlet is responsible for interacting with a client
 * based controller and will fetch resources including content
 * and relevant script.
 *
 * This servlet also will process requests for client observers
 */
public class ControllerServlet extends HttpServlet {
    
    public static final String GIF_SUFFIX = ".gif";
    public static final String JPG_SUFFIX = ".jpg";
    public static final String PNG_SUFFIX = ".png";
    private ServletContext ctx;
    private Logger _logger=null;
    private CatalogFacade cf;
    private static String CACHE = "controller_cache";
    private static String CACHE_TIMES = "controller_cache_times";
    private static final String FILE_UL_RESPONSE = "fileuploadResponse";
    private static final String PERSIST_FAILURE = "persist_failure";
    private static final boolean bDebug=false;
    
    
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        ctx = config.getServletContext();
        cf = (CatalogFacade)ctx.getAttribute("CatalogFacade");
    }
    
    public void destroy() {
        cf = null;
    }
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if(request.getServletPath().endsWith("ImageServlet")) {
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
            
        } else if(request.getServletPath().endsWith("CaptchaServlet")) {
            
            SimpleCaptcha captcha = new SimpleCaptcha();
            BufferedImage bimg = captcha.getCaptchaImageWithSession(request.getSession());
            
            response.setHeader("Cache-Control", "no-store");
            response.setHeader("Pragma", "no-cache");
            response.setDateHeader("Expires", 0);
            response.setContentType("image/jpeg");
            OutputStream out = response.getOutputStream();
            ImageIO.write(bimg, "jpeg", out);
            out.flush();
            out.close();
            
        } else if(request.getServletPath().endsWith("FileUploadResponseServlet")) {
            
            // xml or json
            String reqContentType = request.getParameter("reqContentType");
            
            // there must be a session already, but just in case.
            HttpSession session = request.getSession(true);
            
            Boolean cInvalid = (Boolean)session.getAttribute("captchaInvalid");
            Boolean pFailure = (Boolean)session.getAttribute(PERSIST_FAILURE);
            if (cInvalid == null) {
                cInvalid = new Boolean(false);
            }
            if (pFailure == null) {
                pFailure = new Boolean(false);
            }
            
            if (reqContentType!=null && reqContentType.equals("xml")) {
                response.setContentType("text/xml;charset=UTF-8");
            } else {
                response.setContentType("text/javascript");
            }
            response.setHeader("Pragma", "No-Cache");
            response.setHeader("Cache-Control", "no-cache,no-store,max-age=0");
            response.setDateHeader("Expires", 1);
            PrintWriter writer = response.getWriter();
            
            StringBuffer sb=new StringBuffer();
            if (cInvalid.booleanValue()) {
                // captcha was invalid
                response.setStatus(response.SC_UNAUTHORIZED);
                if (reqContentType!=null && reqContentType.equals("xml")) {
                    sb.append("<response>");
                    sb.append("<message>");
                    sb.append("Plase enter the correct captcha string");
                    sb.append("</message>");
                    sb.append("</response>");
                } else {
                    sb.append("{");
                    sb.append(constructJsonEntry("message", "Please enter the correct captcha string"));
                    sb.append("}");
                }
            } else if (pFailure.booleanValue()) {
                response.setStatus(response.SC_INTERNAL_SERVER_ERROR );
                if (reqContentType!=null && reqContentType.equals("xml")) {
                    sb.append("<response>");
                    sb.append("<message>");
                    sb.append("Persistence failed. The entered address is invalid?");
                    sb.append("</message>");
                    sb.append("</response>");
                } else {
                    sb.append("{");
                    sb.append(constructJsonEntry("message", "Persistence failed. The entered address is invalid?"));
                    sb.append("}");
                }
            } else {
                // captcha was valid
                FileUploadResponse flr = (FileUploadResponse)session.getAttribute(FILE_UL_RESPONSE);
                if (flr != null) {
                    if (reqContentType!=null && reqContentType.equals("xml")) {
                        sb.append("<response>");
                        sb.append("<itemid>");
                        sb.append(flr.getItemId());
                        sb.append("</itemid>");
                        sb.append("<productId>");
                        sb.append(flr.getProductId());
                        sb.append("</productId>");
                        sb.append("<message>");
                        sb.append(flr.getMessage());
                        sb.append("</message>");
                        sb.append("<status>");
                        sb.append(flr.getStatus());
                        sb.append("</status>");
                        sb.append("<duration>");
                        sb.append(flr.getDuration());
                        sb.append("</duration>");
                        sb.append("<duration_string>");
                        sb.append(flr.getDurationString());
                        sb.append("</duration_string>");
                        sb.append("<start_date>");
                        sb.append(flr.getStartDate());
                        sb.append("</start_date>");
                        sb.append("<end_date>");
                        sb.append(flr.getEndDate());
                        sb.append("</end_date>");
                        sb.append("<upload_size>");
                        sb.append(flr.getUploadSize());
                        sb.append("</upload_size>");
                        sb.append("<thumbnail>");
                        sb.append(flr.getThumbnail());
                        sb.append("</thumbnail>");
                        sb.append("</response>");
                    } else {
                        sb.append("{");
                        sb.append(constructJsonEntry("itemid", flr.getItemId()) + ",\n");
                        sb.append(constructJsonEntry("productid", flr.getProductId()) + ",\n");
                        sb.append(constructJsonEntry("message", flr.getMessage()) + ",\n");
                        sb.append(constructJsonEntry("status", flr.getStatus()) + ",\n");
                        sb.append(constructJsonEntry("duration", flr.getDuration()) + ",\n");
                        sb.append(constructJsonEntry("duration_string", flr.getDurationString()) + ",\n");
                        sb.append(constructJsonEntry("start_date", flr.getStartDate()) + ",\n");
                        sb.append(constructJsonEntry("end_date", flr.getEndDate()) + ",\n");
                        sb.append(constructJsonEntry("upload_size", flr.getUploadSize()) + ",\n");
                        sb.append(constructJsonEntry("thumbnail", flr.getThumbnail()));
                        sb.append("}");
                    }
                }
            }
            try {
                writer.write(sb.toString());
                writer.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            
        } else if(request.getServletPath().endsWith("catalog")) {
            request.setCharacterEncoding("UTF-8");
            String command = request.getParameter("command");
            if ("category".equals(command)) {
                String catid = request.getParameter("catid");
                //System.out.println("Request for category with id: " + catid);
                // set content-type header before accessing the Writer
                response.setContentType("text/xml;charset=UTF-8");
                PrintWriter out = response.getWriter();
                String str = handleCategory(catid);
                out.println(str);
                out.close();
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
                // set content-type header before accessing the Writer
                response.setContentType("text/xml;charset=UTF-8");
                // leave these headers here for development - remove for deploy
                response.setHeader("Cache-Control", "no-cache");
                response.setHeader("Pragma", "no-cache");
                PrintWriter out = response.getWriter();
                String baseURL = "http://" + request.getServerName() + ":" + request.getServerPort() + "/" + request.getContextPath() + "/ImageServlet/";
                List items = cf.getItemsVLH(pid, start, length);
                //get response data
                String str = handleItems(items, baseURL);
                out.println(str);
                out.close();
            } else if ("itemInChunck".equals(command)) {
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
                PrintWriter out = response.getWriter();
                String baseURL = "http://" + request.getServerName() + ":" + request.getServerPort() + "/" + request.getContextPath() + "/ImageServlet/";
                List items = cf.getItemInChunckVLH(pid, itemId, length);
                //get response data
                if (items != null) {
                    String str = handleItems(items, baseURL);
                    out.println(str);
                } else {
                    out.println("<items></items>");
                }
                out.close();
            } else if ("categories".equals(command)) {
                //System.out.println("Request for categories.");
                String format = request.getParameter("format");
                
                //get response data in proper format
                String str = handleCategories(format);
                
                if ((format != null) && format.toLowerCase().equals("json")) {
                    response.setContentType("text/javascript;charset=UTF-8");
                } else {
                    response.setContentType("text/xml;charset=UTF-8");
                }
                PrintWriter out = response.getWriter();
                out.println(str);
                out.close();
            } else if ("item".equals(command)) {
                String targetId = request.getParameter("id");
                //System.out.println("CatalogServlet: Request for item with id: " + targetId);
                String str = handleItem(targetId);
                response.setContentType("text/xml;charset=UTF-8");
                PrintWriter out = response.getWriter();
                out.println(str);
                out.close();
            }
            
        } else if(request.getServletPath().endsWith("controller")) {
            // original controller servlet
            request.setCharacterEncoding("UTF-8");
            String command = request.getParameter("command");
            //System.out.println("ControllerServlet : command=" + command);
            
            if ("content".equals(command)) {
                String target = request.getParameter("target");
                //System.out.println("ControllerServlet : target=" + target);
                if (target != null) target = target.trim();
                response.setContentType("text/html;charset=UTF-8");
                PrintWriter out = response.getWriter();
                StringBuffer content = getResource(target, true, true);
                out.write(content.toString());
                out.close();
            }
        } else {
            getLogger().log(Level.SEVERE, "Servlet '" + request.getServletPath() + "' not registered in ControllerServlet!!");
            HttpServletResponse httpResponse=(HttpServletResponse)response;
            httpResponse.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    
    
    
    
    
    public StringBuffer getResource(String resource, boolean fromWeb, boolean cacheContent) {
        InputStream stream = null;
        URLConnection con;
        try {
            if (!fromWeb) {
                URL url = ControllerServlet.class.getResource(resource);
                con = url.openConnection();
            } else {
                // check the time stamp on the resource
                URL url = ctx.getResource(resource);
                con = url.openConnection();
            }
            if (cacheContent) {
                HashMap cache = (HashMap)ctx.getAttribute(CACHE);
                HashMap cacheTimes = (HashMap)ctx.getAttribute(CACHE_TIMES);
                if (cache == null) {
                    cache = new HashMap();
                    cacheTimes = new HashMap();
                    ctx.setAttribute(CACHE, cache);
                    ctx.setAttribute(CACHE_TIMES, cacheTimes);
                }
                long lastModified = con.getLastModified();
                long cacheModified = 0;
                if (cacheTimes.get(resource) != null) {
                    cacheModified = ((Long)cacheTimes.get(resource)).longValue();
                }
                if (cacheModified < lastModified) {
                    StringBuffer buffer = getResource(con.getInputStream());
                    synchronized(cacheTimes) {
                        cacheTimes.put(resource, new Long(lastModified));
                    }
                    synchronized(cache) {
                        cache.put(resource, buffer);
                    }
                    return buffer;
                } else {
                    return (StringBuffer)cache.get(resource);
                }
            } else {
                return getResource(con.getInputStream());
            }
        } catch (Exception e) {
            getLogger().log(Level.SEVERE, "ControllerServlet:loadResource error: Could not load", resource + " - " + e.toString());
        }
        return null;
    }
    
    private StringBuffer getResource(InputStream stream) {
        StringBuffer buffer = new StringBuffer();
        BufferedReader bufReader = null;
        String curLine = null;
        try {
            bufReader = new BufferedReader(new InputStreamReader(stream));
            while (null != (curLine = bufReader.readLine())) {
                buffer.append(curLine + "\n");
            }
        } catch (Exception e) {
            getLogger().log(Level.SEVERE, "ControllerServlet:loadResource from stream error", e);
        }
        return buffer;
    }
    
    
    private String handleItems(String pid, int start, int length, String baseURL) {
        StringBuffer sb = new StringBuffer();
        // then write the data of the response
        sb.append("<items>\n");
        List items = cf.getItemsVLH(pid, start, length);
        Iterator<Item> it = items.iterator();
        NumberFormat formatter = new DecimalFormat("00.00");
        while (it.hasNext()) {
            Item i = it.next();
            sb.append("<item>\n");
            sb.append(" <id>" + i.getItemID() + "</id>\n");
            sb.append(" <product-id>" + i.getProductID() + "</product-id>\n");
            sb.append(" <rating>" + i.checkAverageRating() + "</rating>\n");
            sb.append(" <name>" + i.getName() + "</name>\n");
            sb.append(" <description>" + i.getDescription() + "</description>\n");
            sb.append(" <price>" + formatter.format(i.getPrice()) + "</price>\n");
            sb.append(" <image-url>" + baseURL + i.getImageURL() + "</image-url>\n");
            sb.append(" <image-tb-url>" + baseURL + i.getImageThumbURL() + "</image-tb-url>\n");
            sb.append("</item>\n");
        }
        sb.append("</items>");
        return sb.toString();
    }
    
    private String handleItems(List items, String baseURL) {
        StringBuffer sb = new StringBuffer();
        // then write the data of the response
        sb.append("<items>\n");
        //System.out.println("**** Items length=" + items.size());
        Iterator<Item> it = items.iterator();
        NumberFormat formatter = new DecimalFormat("00.00");
        while (it.hasNext()) {
            Item i = it.next();
            sb.append("<item>\n");
            sb.append(" <id>" + i.getItemID() + "</id>\n");
            sb.append(" <product-id>" + i.getProductID() + "</product-id>\n");
            sb.append(" <rating>" + i.checkAverageRating() + "</rating>\n");
            sb.append(" <name>" + i.getName() + "</name>\n");
            sb.append(" <description>" + i.getDescription() + "</description>\n");
            sb.append(" <price>" + formatter.format(i.getPrice()) + "</price>\n");
            sb.append(" <image-url>" + baseURL + i.getImageURL() + "</image-url>\n");
            sb.append(" <image-tb-url>" + baseURL + i.getImageThumbURL() + "</image-tb-url>\n");
            sb.append("</item>\n");
        }
        sb.append("</items>");
        return sb.toString();
    }
    
    private String handleCategory(String categoryId) {
        StringBuffer sb = new StringBuffer();
        // then write the data of the response
        sb.append("<category>\n");
        sb.append("<cat-id>" + categoryId + "</cat-id>\n");
        sb.append("<cat-name>" + cf.getCategory(categoryId).getName()  + "</cat-name>\n");
        sb.append("<items>\n");
        List items = cf.getAllItemsFromCategory(categoryId);
        Iterator<Item> it = items.iterator();
        NumberFormat formatter = new DecimalFormat("00.00");
        while (it.hasNext()) {
            Item i = it.next();
            sb.append("<item>\n");
            sb.append(" <id>" + i.getItemID() + "</id>\n");
            sb.append(" <prod-id>" + i.getProductID() + "</prod-id>\n");
            sb.append(" <cat-id>" + categoryId + "</cat-id>\n");
            sb.append(" <name>" + i.getName() + "</name>\n");
            sb.append(" <price>" + formatter.format(i.getPrice()) + "</price>\n");
            sb.append(" <description>" + i.getDescription() + "</description>\n");
            sb.append(" <image-url>" + i.getImageURL() + "</image-url>\n");
            sb.append("</item>\n");
        }
        sb.append("</items>");
        sb.append("</category>\n");
        return sb.toString();
    }
    
    private String handleItem(String targetId){
        NumberFormat formatter = new DecimalFormat("00.00");
        Item i = cf.getItem(targetId);
        StringBuffer sb = new StringBuffer();
        sb.append("<item>\n");
        sb.append(" <id>" + i.getItemID() + "</id>\n");
        sb.append(" <cat-id>" + i.getProductID() + "</cat-id>\n");
        sb.append(" <name>" + i.getName() + "</name>\n");
        sb.append(" <description>" + i.getDescription() + "</description>\n");
        sb.append(" <image-url>" + i.getImageURL() + "</image-url>\n");
        sb.append(" <price>" + formatter.format(i.getPrice())  + "</price>\n");
        sb.append("</item>\n");
        return sb.toString();
    }
    
    private String handleCategories(String format){
        StringBuffer sb = new StringBuffer();
        if ((format != null) && format.toLowerCase().equals("json")) {
            sb.append("[\n");
            List categories = cf.getCategories();
            Iterator<Category> it = categories.iterator();
            while (it.hasNext()) {
                Category c = it.next();
                String catid = c.getCategoryID() + "";
                sb.append("{");
                sb.append("\"id\":\"" + c.getCategoryID() + "\",");
                sb.append("\"catid\":\"" + catid + "\",");
                sb.append("\"name\":\"" + c.getName() + "\",");
                sb.append("\"description\":\"" + c.getDescription() + "\",");
                sb.append("\"imageURL\":\"" + c.getImageURL() + "\",");
                sb.append("\"products\": [");
                // get the products in that category
                List products = cf.getProducts(catid);
                Iterator<Product> pit = products.iterator();
                while (pit.hasNext()) {
                    Product p = pit.next();
                    sb.append("{");
                    sb.append("\"id\":\"" + p.getProductID() + "\",");
                    sb.append("\"catid\":\"" + catid + "\",");
                    sb.append("\"name\":\"" + p.getName()+ "\",");
                    sb.append("\"description\":\"" + p.getDescription() + "\",");
                    sb.append("\"imageURL\":\"" + p.getImageURL() + "\"");
                    sb.append("}");
                    if (pit.hasNext()) {
                        sb.append(",");
                    }
                }
                sb.append("]");
                sb.append("}");
                if (it.hasNext()) {
                    sb.append(",\n");
                }
            }//end while loop
            sb.append("\n]");
        } else {
            sb.append("<categories>\n");
            List categories = cf.getCategories();
            Iterator<Category> it = categories.iterator();
            while (it.hasNext()) {
                Category c = it.next();
                sb.append("<category>\n");
                sb.append(" <id>" + c.getCategoryID() + "</id>\n");
                sb.append(" <cat-id>" + c.getCategoryID()+ "</cat-id>\n");
                sb.append(" <name>" + c.getName() + "</name>\n");
                sb.append(" <description>" +c.getDescription() + "</description>\n");
                sb.append(" <image-url>" + c.getImageURL() + "</image-url>\n");
                sb.append("</category>\n");
            }
            sb.append("</categories>\n");
        }
        return sb.toString();
    }
    
    
    private String constructJsonEntry(String key, String value) {
        String dq = "\"";
        return (key + " : " + dq + value + dq);
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
    
}
