package com.appspot.com.empaemperium.resources;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;

@Path("/TopListOld")
public class TopListResources {
	// private constants
	private static final int RETURN_IN_PAGE = 10; 
	
	@GET
	@Produces("application/json")
	public List<Object> getTopList()
	{
		return getTopList(1);
	}
	
	@GET
	@Produces("application/json")	
	@Consumes("text/plain")
	@Path("{id}")
	public List<Object> getTopList(@PathParam("id") String id) {
		try
		{
			int i = Integer.parseInt(id.trim());
			return getTopList(i);
		}
		catch(NumberFormatException nfe)
		{
			return new ArrayList<Object>();
			//return "NumberFormatException: " + nfe.getMessage();
		}
	}
	
	@GET
	@Produces("text/plain")	
	@Consumes("text/plain")
	public String getHello()
	{
		return "hej";
	}
	
	
	
	private List<Object> getTopList(int id)
	{
		if(id <= 0)
			id = 1;
		int toId = (id * RETURN_IN_PAGE) - 1;
		int fromId = toId - (RETURN_IN_PAGE - 1);
		
		// get from datastore
		String query = "select from " + Object.class.getName() + " order by stars range " + fromId + "," + toId;
		List<Object> objects = Utilities.Datastore.getObjectsFromDS(query);
		return objects;
//		String hej = "";
//		if(objects.isEmpty())
//			hej = "Tom databas";
//		else
//		{
//			for(Object o : objects)
//			{
//				hej += " value: " + o.getObject();
//			}
//		}
//		return "-- Returning objects " + Integer.toString(fromId) + " to " + Integer.toString(toId) + " - " + hej;
	}
}
