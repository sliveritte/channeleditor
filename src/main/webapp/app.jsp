<%@page contentType="text/javascript; charset=UTF-8"%>
<%@page import="org.apache.commons.fileupload.servlet.ServletFileUpload"%>
<%@page import="org.apache.commons.fileupload.FileItemFactory"%>
<%@page import="java.util.List"%>
<%@page import="org.apache.commons.fileupload.FileItem"%>
<%@page import="java.util.Iterator"%>
<%@page import="org.apache.commons.fileupload.disk.DiskFileItemFactory" %>
<%@page import="java.util.zip.ZipInputStream" %>
<%@page import="java.io.Writer"
%><%@page import="java.io.InputStream"
%><%@page import="java.util.zip.ZipEntry"
%><%@page import="java.util.Enumeration"
%><%@page import="java.util.zip.ZipFile"
%><%@page import="javax.xml.bind.DatatypeConverter,java.io.ByteArrayOutputStream"
%>
<%
FileItemFactory factory = new DiskFileItemFactory();
ServletFileUpload upload = new ServletFileUpload(factory);
upload.setSizeMax(254*1024);
List<FileItem> fields = upload.parseRequest(request);
Iterator<FileItem> it = fields.iterator();
while (it.hasNext()) {
	FileItem fileItem = it.next();
	if (!fileItem.isFormField()) {
		ZipInputStream zip = new ZipInputStream(fileItem.getInputStream());
		String delim = "";
		//StringBuilder result = new StringBuilder();
		Writer result = out;
		result.append("content={");
		ZipEntry file;
		while((file = zip.getNextEntry()) != null) {
			result.append(delim);
			delim = ", ";
			
			InputStream in = zip;
			ByteArrayOutputStream arrOut = new ByteArrayOutputStream();
			int pos = 0;
			int read;
			byte[] buff = new byte[4096];
			while((read = in.read(buff, pos, buff.length - pos)) != -1) {
				arrOut.write(buff, 0, read);
			}

			buff = arrOut.toByteArray();
			String encoded = DatatypeConverter.printBase64Binary(buff);
			result.append("'");
			result.append(file.getName());
			result.append("': '");
			result.append(encoded);
			result.append("'");
		}
		zip.close();
		result.append("}");
	}
}
%>
