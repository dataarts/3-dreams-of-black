package com.appspot.com.empaemperium.resources;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import com.google.gson.Gson;

@Path("/get")
public class GetResources {
	@SuppressWarnings("unchecked")
	@GET
	@Produces("text/plain")	
	@Consumes("text/plain")
	@Path("/{id}")
	public String getTopList(@PathParam("id") String strId) {
		int id = Utilities.ConvertStringToInt(strId);
		
		if(id > 0)
		{
			Object obj = null;
			PersistenceManager pm = PMF.get().getPersistenceManager();
			try
			{			
				// specify query
				Query query = pm.newQuery(Object.class);
				
				query.setFilter("disabled == False && key == " + id);	// Get for id and only enabled object				
				query.declareParameters("Boolean False");								
						
				List<Object> listObjects = (List<Object>) query.execute(false);
				if(listObjects.size() == 1)
				{				
					obj = listObjects.get(0);
					
					// update
					listObjects.get(0).addPoints();
				}
			}
			finally {
				pm.close();
				
				if(obj != null)
					return new Gson().toJson(obj);
			}
			//get object for id		
			/*Boolean bool = false;
			String query = "select from " + Object.class.getName() + " where key == " + id + " and disabled == " + bool;
			Object obj = Utilities.Datastore.getObjectFromDS(query);
			if(obj != null)			
				return new Gson().toJson(obj);*/			
		}
		return "";		
	}
}
