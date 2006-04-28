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
                thumbpath = "http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/";
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
        <button onclick="location.href='fileupload.jsp'">Submit another pet</button>
        <button onclick="location.href='http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/index.jsp'">Go back to home</button>
    </div>
    </center>
    
    </body>
</html>
