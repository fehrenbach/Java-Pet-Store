/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: ControllerServlet.java,v 1.22 2006-12-01 21:38:39 basler Exp $ */

package com.sun.javaee.blueprints.petstore.controller;

import com.sun.javaee.blueprints.petstore.captcha.SimpleCaptcha;
import com.sun.javaee.blueprints.petstore.model.CatalogFacade;
import com.sun.javaee.blueprints.petstore.model.Category;
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
import java.util.logging.Level;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.sun.javaee.blueprints.petstore.util.PetstoreUtil;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.nio.channels.WritableByteChannel;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.List;
import javax.imageio.ImageIO;

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
    public static final String CAPTCHA_KEY = "captcha_key";
    public static final String CAPTCHA_STRING = "captcha_string";
    private ServletContext ctx;
    private CatalogFacade cf;
    private static String CACHE = "controller_cache";
    private static String CACHE_TIMES = "controller_cache_times";
    private static final boolean bDebug=true;
    
    
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
            serveImage(request, response);
        } else if(request.getServletPath().endsWith("CaptchaServlet")) {
            serveCaptcha(request, response);
        } else if(request.getServletPath().endsWith("catalog")) {
            serveCatalogXML(request, response);
        } else if(request.getServletPath().endsWith("controller")) {
            // original controller servlet
            request.setCharacterEncoding("UTF-8");
            String command = request.getParameter("command");
            if(bDebug) System.out.println("ControllerServlet : command=" + command);
            
            if ("content".equals(command)) {
                String target = request.getParameter("target");
                if(bDebug) System.out.println("ControllerServlet : target=" + target);
                if (target != null) target = target.trim();
                response.setContentType("text/html;charset=UTF-8");
                PrintWriter out = response.getWriter();
                StringBuffer content = getResource(target, true, true);
                out.write(content.toString());
                out.close();
            }
        } else if(request.getServletPath().endsWith("TagServlet")) {
            serveTagsXML(request, response);
        } else {
            PetstoreUtil.getLogger().log(Level.SEVERE, "Servlet '" + request.getServletPath() + "' not registered in ControllerServlet!!");
            HttpServletResponse httpResponse=(HttpServletResponse)response;
            httpResponse.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    private void serveImage(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
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
                PetstoreUtil.getLogger().log(Level.SEVERE, "image_does_not_exist", PetstoreConstants.PETSTORE_IMAGE_DIRECTORY + pathInfo);
                return;
            }
        }
        
        FileChannel in = null;
        WritableByteChannel out = null;
        
        // serve up image from proper location
        try {
            in = new FileInputStream(imageFile).getChannel();
            out = Channels.newChannel(response.getOutputStream());
            in.transferTo(0, in.size(), out);
        } catch (IOException e) {
            throw e;
        } finally {
            try {
                if(in != null) {
                    in.close();
                }
            } catch (IOException ioe) {}
            try {
                if(out != null) {
                    out.close();
                }
            } catch (IOException ioe) {}
        }
    }
    
    private void serveTagsXML(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/xml;charset=UTF-8");
        PrintWriter out=response.getWriter();
        String itemId=request.getParameter("itemId");
        String sxTags=request.getParameter("tags");
        if(bDebug) System.out.println("Have tagServlet " + itemId + " - " + sxTags);
        try {
            cf.addTagsToItemId(sxTags, itemId);
        } catch (Exception ee) {
            ee.printStackTrace();
        }
        out.println("<response>");
        out.print("<itemId>");
        out.print(itemId);
        out.println("</itemId>");
        out.print("<tags>");
        out.print(cf.getItem(itemId).tagsAsString());
        out.println("</tags>");
        out.println("</response>");
        out.close();
    }
    
    private void serveCaptcha(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SimpleCaptcha captcha = new SimpleCaptcha();
        // just in case... not really necessary to store the session id here
        HttpSession session = request.getSession();
        session.setAttribute(CAPTCHA_KEY, session.getId());
        String cstring = captcha.generateCaptchaString(5);
        session.setAttribute(CAPTCHA_STRING, cstring);
        BufferedImage bimg = captcha.getCaptchaImage(cstring);
        
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);
        response.setContentType("image/jpeg");
        OutputStream out = response.getOutputStream();
        ImageIO.write(bimg, "jpeg", out);
        out.flush();
        out.close();
    }
    
    private void serveCatalogXML(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String command = request.getParameter("command");
        if ("category".equals(command)) {
            String catid = request.getParameter("catid");
            if(bDebug) System.out.println("Request for category with id: " + catid);
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
            PrintWriter out = response.getWriter();
            String baseURL = "http://" + request.getServerName() + ":" + request.getServerPort() + "/" + request.getContextPath() + "/ImageServlet/";
            List items = cf.getItemInChunkVLH(pid, itemId, length);
            //get response data
            if (items != null) {
                String str = handleItems(items, baseURL);
                out.println(str);
            } else {
                out.println("<items></items>");
            }
            out.close();
        } else if ("categories".equals(command)) {
            if(bDebug) System.out.println("Request for categories.");
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
            if(bDebug) System.out.println("CatalogServlet: Request for item with id: " + targetId);
            String str = handleItem(targetId);
            response.setContentType("text/xml;charset=UTF-8");
            PrintWriter out = response.getWriter();
            out.println(str);
            out.close();
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
                        cacheTimes.put(resource, Long.valueOf(lastModified));
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
            PetstoreUtil.getLogger().log(Level.SEVERE, "ControllerServlet:loadResource error: Could not load", resource + " - " + e.toString());
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
        } catch (IOException e) {
            PetstoreUtil.getLogger().log(Level.SEVERE, "ControllerServlet:loadResource from stream error", e);
        }
        return buffer;
    }
    
    private String handleItems(List items, String baseURL) {
        StringBuffer sb = new StringBuffer();
        // then write the data of the response
        sb.append("<items>\n");
        if(bDebug) System.out.println("**** Items length=" + items.size());
        NumberFormat formatter = new DecimalFormat("00.00");
        for (Item i : (List<Item>) items) {
            sb.append("<item>\n");
            sb.append(" <id>" + i.getItemID() + "</id>\n");
            sb.append(" <product-id>" + i.getProductID() + "</product-id>\n");
            sb.append(" <rating>" + i.checkAverageRating() + "</rating>\n");
            sb.append(" <name>" + i.getName() + "</name>\n");
            sb.append(" <description><![CDATA[" + i.getDescription() + "]]></description>\n");
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
        NumberFormat formatter = new DecimalFormat("00.00");
        for (Item i : cf.getAllItemsFromCategory(categoryId)) {
            sb.append("<item>\n");
            sb.append(" <id>" + i.getItemID() + "</id>\n");
            sb.append(" <prod-id>" + i.getProductID() + "</prod-id>\n");
            sb.append(" <cat-id>" + categoryId + "</cat-id>\n");
            sb.append(" <name>" + i.getName() + "</name>\n");
            sb.append(" <price>" + formatter.format(i.getPrice()) + "</price>\n");
            sb.append(" <description><![CDATA[" + i.getDescription() + "]]></description>\n");
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
        sb.append(" <description><![CDATA[" + i.getDescription() + "]]></description>\n");
        sb.append(" <image-url>" + i.getImageURL() + "</image-url>\n");
        sb.append(" <price>" + formatter.format(i.getPrice())  + "</price>\n");
        sb.append("</item>\n");
        return sb.toString();
    }
    
    private String handleCategories(String format){
        StringBuffer sb = new StringBuffer();
        if ((format != null) && format.toLowerCase().equals("json")) {
            sb.append("[\n");
            boolean first = true;
            for (Category c : cf.getCategories()) {
                if (first) {
                    first = false;
                } else {
                    sb.append(",\n");
                }
                String catid = c.getCategoryID() + "";
                sb.append("{");
                sb.append("\"id\":\"" + c.getCategoryID() + "\",");
                sb.append("\"catid\":\"" + catid + "\",");
                sb.append("\"name\":\"" + c.getName() + "\",");
                sb.append("\"description\":\"" + c.getDescription() + "\",");
                sb.append("\"imageURL\":\"" + c.getImageURL() + "\",");
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
                    sb.append("\"id\":\"" + p.getProductID() + "\",");
                    sb.append("\"catid\":\"" + catid + "\",");
                    sb.append("\"name\":\"" + p.getName()+ "\",");
                    sb.append("\"description\":\"" + p.getDescription() + "\",");
                    sb.append("\"imageURL\":\"" + p.getImageURL() + "\"");
                    sb.append("}");
                }
                sb.append("]");
                sb.append("}");
            }
            sb.append("\n]");
        } else {
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
    
    
    private String constructJsonEntry(String key, String value) {
        String dq = "\"";
        return (key + " : " + dq + value + dq);
    }
    
    
}
