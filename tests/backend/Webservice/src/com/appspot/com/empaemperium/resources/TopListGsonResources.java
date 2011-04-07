package com.appspot.com.empaemperium.resources;

import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import com.google.gson.Gson;

@Path("/toplist")
public class TopListGsonResources {
	// private constants
	private static final int RETURN_IN_PAGE = 10; 
	
	@GET
	@Produces("text/plain")
	public String getTopList()
	{
		return getTopList(1);
	}
	
	@GET
	@Produces("text/plain")	
	@Consumes("text/plain")
	@Path("{id}")
	public String getTopList(@PathParam("id") String id) {
		return getTopList(Utilities.ConvertStringToInt(id));
	}
		
	private String getTopList(int id)
	{
		// check incoming value
		if(id <= 0) id = 1;
		int toId = (id * RETURN_IN_PAGE) - 1;
		int fromId = toId - (RETURN_IN_PAGE - 1);
		
		// get objects
		String query = "select from " + ObjectSimple.class.getName() + " range " + fromId + "," + toId;
		List<ObjectSimple> objects = Utilities.Datastore.getObjectsSimpleFromDS(query);
		return new Gson().toJson(objects);
	}
}
