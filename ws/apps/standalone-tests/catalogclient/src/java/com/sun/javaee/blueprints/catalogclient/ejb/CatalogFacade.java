package com.sun.javaee.blueprints.catalogclient.ejb;

import javax.ejb.*;
import java.util.*;

public interface CatalogFacade {       
    public Collection getCategories();
    public Collection getProducts(String catID);
    public Collection getItems(String prodID);      
}