package com.appspot.com.empaemperium.resources;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.HeaderParam;

import com.google.gson.Gson;

import java.net.UnknownHostException;
import java.util.Date;

@Path("/add")
public class AddResources {	
	// Private security values
	@HeaderParam("host") private String hostname;
	@HeaderParam("referer") private String referer;
	
	@POST
	@Consumes("application/x-www-form-urlencoded")	
	@Produces("text/plain")
	public String addObject(@FormParam("object") String object) {
		// set object
		Date date = new Date();		
		Object obj = new Object(object, date);		
		
		// save to datastore
		Utilities.Datastore.addObjectToDS(obj);
		
		// return key as json
		return "{\"key\":"+ new Gson().toJson(obj.getKey()) + getHostDebug() + "}";		      
	}	
	
	@POST
	@Path("/stars/{id}")
	@Consumes("application/x-www-form-urlencoded")
	@Produces("text/plain")
	public String addStar(@PathParam("id") String id)
	{
		return addValues(id, 1, Utilities.Enumerations.UpdateActions.STARS);
	}
	
	@POST
	@Path("/stars/{id}/{amount}")
	@Consumes("application/x-www-form-urlencoded")
	@Produces("text/plain")
	public String addStarWithAmount(@PathParam("id") String id, @PathParam("amount") String amount)
	{
		return addValues(id, Utilities.ConvertStringToInt(amount), Utilities.Enumerations.UpdateActions.STARS);
	}	
	
	@POST
	@Path("/points/{id}")
	@Consumes("application/x-www-form-urlencoded")
	@Produces("text/plain")
	public String addPoints(@PathParam("id") String id)
	{
		return addValues(id, 1, Utilities.Enumerations.UpdateActions.POINTS);
	}
	
	@POST
	@Path("/points/{id}/{amount}")
	@Consumes("application/x-www-form-urlencoded")
	@Produces("text/plain")
	public String addPointsWithAmount(@PathParam("id") String id, @PathParam("amount") String amount)
	{		
		return addValues(id, Utilities.ConvertStringToInt(amount), Utilities.Enumerations.UpdateActions.POINTS);	
	}
	
	/**
	 * Add points or stars with amount
	 * @param id
	 * @param amount
	 * @param action
	 * @return
	 */
	private String addValues(String id, int amount, Utilities.Enumerations.UpdateActions action)
	{
		Utilities.Datastore.updateObject(id, action, amount);
		return "{\"action\": \"" + action.toString()+ "\"" + getHostDebug() + "}";
	}
	
	/**
	 * Get Hostdebug - for tesing only
	 * @return
	 */
	private String getHostDebug()
	{
		return ", \"debug\": \"{\"host\":\"" + hostname + "\",\"refer\": \"" + referer + "\", \"currenthost\": \"" + getHostname() + "\"}\"";
	}
	
	/**
	 * Get current Hostname
	 * @return
	 */
	private String getHostname()
	{
		try {
			return java.net.InetAddress.getLocalHost().getHostName();
		}
		catch(UnknownHostException e) {
			return "";
		}
	}
}