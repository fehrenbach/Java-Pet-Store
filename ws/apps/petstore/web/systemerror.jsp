<%-- Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: systemerror.jsp,v 1.1 2006-11-10 03:45:27 sean_brydon Exp $ --%>

<html>
 <head>
  <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
  <title>Java Pet Store Reference Application: System Error Page</title>
 </head>
<body>

<jsp:include page="banner.jsp" />

  <h2>System Error !</h2>
   <p>We had problems processing your request. We had a system error 
      so perhaps your application was not set up or deployed properly.</p>
       
      Need to obtain error message and print out something here.
      
   <p><a href="${pageContext.request.contextPath}/faces/index.jsp">Go back to sample application home</a></p>
 <br/><br/>
 <jsp:include page="footer.jsp" />

</body>
</html>
