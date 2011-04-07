package com.appspot.com.empaemperium.resources;

import com.google.appengine.api.datastore.Key;
//import com.google.appengine.api.users.User;

import java.util.Date;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
@PersistenceCapable
public class ObjectSimple {
	/* ----------------------------------------------------
	 Variables
	---------------------------------------------------- */	
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private transient Key keySimple;
	
	@Persistent
	private Key key;
	
	@Persistent
	private String object;
	
	@Persistent
	private transient Date date;
	
	
	/* ----------------------------------------------------
	 Constructors
	---------------------------------------------------- */
	public ObjectSimple(Key key, String object, Date date)
	{
		this.key = key;
		this.object = object;
		this.date = date;	
	}
	
	
	/* ----------------------------------------------------
	 Public getters/setters methods
	---------------------------------------------------- */
	public Key getKey()
	{
		return this.key;
	}	
	
	public Key getSimpleKey()
	{
		return this.keySimple;
	}
	
	public String getObject()
	{
		return this.object;	
	}
	
	public Date getDate()
	{
		return this.date;
	}	
}
