<%@page import="java.util.zip.ZipOutputStream"
%><%@page import="java.io.Writer"
%><%@page import="java.io.InputStream"
%><%@page import="java.util.zip.ZipEntry"
%><%@page import="java.util.Enumeration"
%><%@page import="java.util.zip.ZipFile"
%><%@page import="javax.xml.bind.DatatypeConverter"
%><%@ page language="java" contentType="application/octet-stream" 
%><%
	response.setHeader("Content-Disposition", "attachment; filename=channel_list.scm");
	ZipOutputStream zip = new ZipOutputStream(response.getOutputStream());
	Enumeration<String> paramNames = request.getParameterNames();
	while(paramNames.hasMoreElements()) {
		String paramName = paramNames.nextElement();
		zip.putNextEntry(new ZipEntry(paramName));
		String value = request.getParameter(paramName);
		byte[] data = DatatypeConverter.parseBase64Binary(value);
		zip.write(data);
	}
	zip.close();
%>