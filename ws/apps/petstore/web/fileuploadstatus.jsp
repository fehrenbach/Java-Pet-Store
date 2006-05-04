<%-- Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: fileuploadstatus.jsp,v 1.6 2006-05-04 18:55:02 yutayoshida Exp $ --%>

<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Seller Photo Submit Status</title>
        <style type="text/css">
            #status { background-color : #E0FFFF;
                      border : none;
                      width : 50%;
                    }
        </style>
        <script type="text/javascript">
            window.onload = function() {
                var thumbfile = "${param.thumb}";
                if (thumbfile == "") {
                    thumbfile = "${sessionScope['fileuploadResponse'].thumbnail}";
                }
                thumbpath = "http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/ImageServlet/";
                thumbpath += thumbfile;
                var divNode = document.getElementById("thumb");
                var imgNode = document.createElement("img");
                imgNode.setAttribute("src", thumbpath);
                divNode.appendChild(imgNode);
            }
            
        </script>
    </head>
    <body>
    <jsp:include page="banner.jsp"/>
    <center>
    <div id="status">
        <h4>${param.message}</h4>
        Here's the uploaded photo of your pet<br/><br/>
        <div id="thumb"></div>
        <br/><br/>
        Would you like to :-<br/>
        <button onclick="location.href='fileupload.jsp'">Submit another pet</button><br/>
        <button onclick="location.href='http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/index.jsp'">Go back to home</button><br/>
        <button onclick="location.href='catalog.jsp?pid=${param.productId}&itemId=${param.id}'">Go to your pet page</button><br/>

    </div>
    </center>
    <jsp:include page="footer.jsp" />    
    </body>
</html>
