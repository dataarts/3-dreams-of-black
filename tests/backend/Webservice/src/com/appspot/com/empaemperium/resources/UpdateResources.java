package com.appspot.com.empaemperium.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

@Path("/update")
public class UpdateResources {
	@POST
	@Path("/disable/{id}/{bool}")
	@Consumes("application/x-www-form-urlencoded")
	public void Disable(@PathParam("id") String id, @PathParam("bool") String bool)
	{
		Utilities.Datastore.updateObject(id, bool, Utilities.Enumerations.UpdateActions.DISABLE);
	}	
}
