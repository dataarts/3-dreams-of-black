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
public class Object {
	/* ----------------------------------------------------
	 Variables
	---------------------------------------------------- */
	private transient final int MAX_STARS = 5;
	private transient final int MAX_ACCELERATION = 50;
	private transient final int CRON_JOB = 60;
	
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;
	
	@Persistent
	private String object;
	
	@Persistent
	private transient Date date;
	
	@Persistent 
	private transient int points = 0;
	
	@Persistent
	private transient int stars = 0;
	
	@Persistent
	private transient int acceleration = this.CRON_JOB * this.MAX_STARS;
	
	@Persistent
	private transient Boolean disabled = false;
	
	
	/* ----------------------------------------------------
	 Constructors
	---------------------------------------------------- */
	public Object(String object, Date date)
	{
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
	
	public String getObject()
	{
		return this.object;	
	}
	
	public Date getDate()
	{
		return this.date;
	}	
	
	public int getStars()
	{
		return this.stars;
	}
	
	public int getPoints()
	{
		return this.points;		
	}
	
	public int getAcceleration()
	{
		return this.acceleration;
	}
	
	public void setDisabled(Boolean disabled)
	{
		this.disabled = disabled;
	}
	
	public Boolean isDisabled()
	{
		return disabled;
	}	
	
	/* ----------------------------------------------------
	 Public methods
	---------------------------------------------------- */
	public void addPoints()
	{
		addPoints(1);
	}
	
	public void addPoints(int add)
	{
		this.points += add;
		increaseAcceleration(add);
	}
	
	public void addStars()
	{
		addStars(1);
	}
	
	public void addStars(int add)
	{
		int max = this.MAX_STARS;
		if(this.stars < max)
		{			
			this.stars += add;
			increaseAcceleration(add);
		}
		if(this.stars > max)
			this.stars = max;
	}
	
	public void decreaseAcceleration()
	{
		decreaseAcceleration(1);
	}
	
	public void decreaseAcceleration(int remove)
	{
		/**
		 * If administrator has given the object 5 stars (maxStars), than the acceleration will be 0
		 */
		this.acceleration -= (remove * (this.MAX_STARS - this.stars));
		
		// Minimum value is 0
		if(this.acceleration < 0)
			this.acceleration = 0;
	}
	
	public void increaseAcceleration()
	{
		increaseAcceleration(1);
	}
	
	public void increaseAcceleration(int add)
	{
		/**
		 * The increase of acceleration has nothing to do with administration stars. Det skulle bli en samhällsklyfta
		 */
		this.acceleration += (add * this.MAX_STARS);
		
		// Set max-acceleration
		int max = (this.CRON_JOB * this.MAX_ACCELERATION);
		if(this.acceleration > (max))
			this.acceleration = max;
	}
	
	public void setDisabled(String disabled)
	{		
		boolean bool = Boolean.parseBoolean(disabled);
		setDisabled(bool);		
	}
}
