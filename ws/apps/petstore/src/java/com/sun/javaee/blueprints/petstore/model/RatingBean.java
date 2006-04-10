package com.sun.javaee.blueprints.petstore.model;
import java.util.logging.Logger;
/*
 * RatingBean.java
 *
 * Created on March 14, 2006, 4:05 PM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

/**
 *
 * @author basler
 */
public class RatingBean {
    
    private int grade=0, grade2=0, grade3=0;
    private Logger logger=Logger.getLogger("helpme");
    
    /** Creates a new instance of RatingBean */
    public RatingBean() {
    }
    
    public String[] getRatingText() {
        return new String[]{"Hate It", "Below Average", "Average", "Above Average", "Love It"};
    }
    
    
    public void setGrade(int grade) {
        logger.info("\n**** Setting Grade = " + grade);
        this.grade=grade;
    }
    public int getGrade() {
        logger.info("\n*** Getting Grade = " + grade);
        return grade;
    }
    
    public void setGrade2(int grade) {
        logger.info("\n**** Setting Grade2 = " + grade);
        this.grade2=grade;
    }
    public int getGrade2() {
        logger.info("\n*** Getting Grade2 = " + grade2);
        return grade2;
    }
    
    public void setGrade3(int grade) {
        logger.info("\n**** Setting Grade3 = " + grade);
        this.grade3=grade;
    }
    public int getGrade3() {
        logger.info("\n*** Getting Grade3 = " + grade3);
        return grade3;
    }
    
}
