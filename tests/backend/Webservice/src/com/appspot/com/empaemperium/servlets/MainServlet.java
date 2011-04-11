package com.appspot.com.empaemperium.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;

import javax.servlet.http.*;

@SuppressWarnings("serial")
public class MainServlet extends HttpServlet {
	@SuppressWarnings("rawtypes")
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		resp.setContentType("text/plain");
		PrintWriter out = resp.getWriter();
		out.println("No no");
		
		Enumeration headerNames = req.getHeaderNames();
		while(headerNames.hasMoreElements())
		{
			String headerName = (String)headerNames.nextElement();
			out.println(headerName + " - " + req.getHeader(headerName) + "<br/>");
			
		}
		
	}
}