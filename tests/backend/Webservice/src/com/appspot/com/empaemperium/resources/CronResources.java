package com.appspot.com.empaemperium.resources;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

/**
 * Cronjob for this project
 * @author Empa
 *
 */
@Path("/cron")
public class CronResources {
	/**
	 * Create toplist from the big list of objects
	 */
	@SuppressWarnings("unchecked")
	@GET	
	public String UpdateTopList() 
	{
		// ini
		Date date = new Date();
		List<ObjectSimple> listSimple = new ArrayList<ObjectSimple>();
		String q = "";
		Boolean saved = false;
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try
		{			
			// specify query
			Query query = pm.newQuery(Object.class);
			query.setFilter("disabled == False");								// Get only enabled objects
			query.setOrdering("acceleration DESC, stars DESC, points DESC"); 	// Order by acceleration, stars and points
			query.setRange(0,1000);												// Only get 1000 objects
			query.declareParameters("Boolean False");								
					
			List<Object> listObjects = (List<Object>) query.execute(false);
			if(!listObjects.isEmpty())
			{				
				// convert big objects to small toplist-objects
				for(Object obj : listObjects)
				{
					ObjectSimple objSimple = new ObjectSimple(obj.getKey(), obj.getObject(), date);
					listSimple.add(objSimple);
					
					//decrease acceleration for object
					obj.decreaseAcceleration();
				}
				
				// add all new 1000 (at max) to datastore
				Utilities.Datastore.addObjectSimpleToDS(listSimple);
				saved = true;
				
				// update the decrease on the big list
				//pm.makePersistentAll(listObjects);
			}
		}
		finally {
			pm.close();
			
			if(saved)
			{
				// remove old toplist
				q = "select from " + ObjectSimple.class.getName() + " where date < myDate";
				Utilities.Datastore.deleteObjectsSimple(q, date);
			}
		}
		return "Cron job done";
	}	
}
