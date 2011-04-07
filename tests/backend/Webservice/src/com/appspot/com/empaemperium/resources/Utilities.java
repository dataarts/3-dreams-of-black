package com.appspot.com.empaemperium.resources;

import java.util.Date;
import java.util.List;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

/**
 * Utilities for the project
 * @author Andreas Emtinger, 2011
 *
 */
public class Utilities {
	private Utilities()
	{
		throw new AssertionError();
	}
	
	/**
	 * Return number or a 0
	 * @param strInt
	 * @return
	 */
	public static int ConvertStringToInt(String strInt)
	{
		try {
			int i = Integer.parseInt(strInt.trim());
			return i;
		}
		catch(NumberFormatException e)
		{
			return 0;
		}
	}
	
	/**
	 * Datastore methods 
	 *
	 */
	public static class Datastore {
		/**
		 * Get a list of objects
		 * @param the sql-query for datastore
		 * @return List<Object>
		 */
		@SuppressWarnings("unchecked")
		public static List<Object> getObjectsFromDS(String query)
		{
			PersistenceManager pm = PMF.get().getPersistenceManager();		
			return (List<Object>) pm.newQuery(query).execute();
		}
		
		/**
		 * 
		 * @param query
		 * @return Object
		 */
		@SuppressWarnings("unchecked")
		public static List<Object> getObjectsFromDS(Query query)
		{					
			return (List<Object>) query.execute();
		}
			
		/**
		 * Get one object from datastore
		 * @param query
		 * @return Object
		 */
		public static Object getObjectFromDS(String query)
		{
			List<Object> listObjects = getObjectsFromDS(query);
			if(listObjects.size() == 1)
				return listObjects.get(0);
			return null;
		}	
		
		/**
		 * Get a list of objectSimple
		 * @param the sql-query for datastore
		 * @return List<ObjectSimple>
		 */
		@SuppressWarnings("unchecked")
		public static List<ObjectSimple> getObjectsSimpleFromDS(String query)
		{
			PersistenceManager pm = PMF.get().getPersistenceManager();		
			return (List<ObjectSimple>) pm.newQuery(query).execute();
		}
		
		/**
		 * 
		 * @param query
		 * @return ObjectSimple
		 */
		@SuppressWarnings("unchecked")
		public static List<ObjectSimple> getObjectsSimpleFromDS(Query query)
		{					
			return (List<ObjectSimple>) query.execute();
		}
		
		/**
		 * Delete from objectSimple with query
		 * @param query
		 */
		@SuppressWarnings("unchecked")
		public static void deleteObjectsSimple(String query, Date date)
		{
			PersistenceManager pm = PMF.get().getPersistenceManager();
			Query q = pm.newQuery(query);
			q.declareImports("import java.util.Date");
			q.declareParameters("Date myDate");
			List<ObjectSimple> objs = (List<ObjectSimple>) q.execute(date);
			pm.deletePersistentAll(objs);			
		}
		
		/**
		 * 
		 * @param theclass
		 * @return Query
		 */
		public static Query getQuery(@SuppressWarnings("rawtypes") Class theclass)
		{
			PersistenceManager pm = PMF.get().getPersistenceManager();		
			return pm.newQuery(theclass);
		}
		
		/**
		 * Update object with points or stars
		 * @param id 
		 * @param action
		 */
		public static void updateObject(String id, Enumerations.UpdateActions action)
		{
			updateObject(id, action, 1);	
		}
		
		public static void updateObject(String id, String value, Enumerations.UpdateActions action)
		{
			updateObject(id, action, 0, value);	
		}
		
		public static void updateObject(String id, Enumerations.UpdateActions action, int add)
		{
			updateObject(id, action, add, "");
		}
		
		/**
		 * Update object with points or stars
		 * @param id
		 * @param action
		 * @param add
		 */
		@SuppressWarnings("unchecked")
		public static void updateObject(String strId, Enumerations.UpdateActions action, int add, String value)
		{
			int id = ConvertStringToInt(strId);
			if(id > 0)
			{
				PersistenceManager pm = PMF.get().getPersistenceManager();	
				try {	
					Query query = pm.newQuery(Object.class);				
					query.setFilter("key == "+ id);
					List<Object> listObj = (List<Object>)query.execute();
					if(listObj.size() == 1)
					{
						Object obj = listObj.get(0);							
						switch(action)
						{
							case STARS: 
								obj.addStars(add);
								break;
								
							case POINTS:
								obj.addPoints(add);
								break;
							
							case DISABLE:
								obj.setDisabled(value);
								break;
						}
					}
				}
				finally {
					pm.close();
				}	
			}
		}
		
		/**
		 * Add object to datastore
		 * @param obj
		 */
		public static void addObjectToDS(Object obj)
		{
			PersistenceManager pm = PMF.get().getPersistenceManager();		
	        try {
	            pm.makePersistent(obj);
	        } finally {
	            pm.close();
	        }
		}	
		
		/**
		 * Add objectSimple to datastore
		 * @param obj
		 */
		public static void addObjectSimpleToDS(ObjectSimple obj)
		{
			PersistenceManager pm = PMF.get().getPersistenceManager();		
	        try {
	            pm.makePersistent(obj);
	        } finally {
	            pm.close();
	        }
		}
		
		/**
		 * Add a list of objectSimple to datastore
		 * @param listObj
		 */
		public static void addObjectSimpleToDS(List<ObjectSimple> listObj)
		{
			PersistenceManager pm = PMF.get().getPersistenceManager();		
	        try {
	            pm.makePersistentAll(listObj);
	        } finally {
	            pm.close();
	        }
		}
	}
	
	/**
	 * Enumerations in utilites	 
	 */
	public static class Enumerations {
		public static enum UpdateActions 
		{
			STARS, 
			POINTS,
			DISABLE
		}		
	}	
}
