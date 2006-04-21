/* Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: ImageScaler.java,v 1.1 2006-04-21 22:57:31 yutayoshida Exp $ */

package com.sun.javaee.blueprints.petstore.util;

import java.io.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.AffineTransformOp;
import java.awt.geom.AffineTransform;
import javax.imageio.*;

public class ImageScaler {
    
    private int thumbWidth = 133;
    private int thumbHeight = 100;
    private String format = "jpg";
    
    /** Creates a new instance of ImageScaler */
    public ImageScaler() {
    }
    /* constructor with the target image size
     * @param width Width of the target image
     * @param height Height of the target image
     */
    public ImageScaler(int width, int height) {
        this.thumbWidth = width;
        this.thumbHeight = height;
    }
    
    /* Using getScaledInstance
     * good quality, but very slow
     * @param from the path of the original image
     * @param to the path of the target thumbnail
     */
    public void resizeWithScaledInstance(String from, String to) throws IOException {
        BufferedImage image = ImageIO.read(new File(from));
        // petstore specific operation - if height is larger than width,
        // change the default w and h.
        if (image.getHeight() > image.getWidth()) {
            thumbWidth = 75;
            thumbHeight = 100;
        }
        BufferedImage bThumb = new BufferedImage(thumbWidth, thumbHeight, image.getType());
        bThumb.getGraphics().drawImage(image.getScaledInstance(thumbWidth, thumbHeight,
                Image.SCALE_AREA_AVERAGING), 0, 0, thumbWidth, thumbHeight, null);
        ImageIO.write(bThumb, format, new File(to));
    }
    
    /* Using Graphics2D
     * medium quality, fast
     * @param from the path of the original image
     * @param to the path of the target thumbnail
     */
    public void resizeWithGraphics(String from, String to) throws IOException {
        BufferedImage image = ImageIO.read(new File(from));
        // petstore specific operation - if height is larger than width,
        // change the default w and h.
        if (image.getHeight() > image.getWidth()) {
            thumbWidth = 75;
            thumbHeight = 100;
        }
        BufferedImage th = new BufferedImage(thumbWidth, thumbHeight, image.getType());
        Graphics2D g2d = th.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_ALPHA_INTERPOLATION, RenderingHints.VALUE_ALPHA_INTERPOLATION_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_COLOR_RENDERING, RenderingHints.VALUE_COLOR_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_DITHERING, RenderingHints.VALUE_DITHER_ENABLE);
        g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_FRACTIONALMETRICS, RenderingHints.VALUE_FRACTIONALMETRICS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_STROKE_CONTROL, RenderingHints.VALUE_STROKE_NORMALIZE);
        g2d.drawImage(image, 0, 0, thumbWidth, thumbHeight, null);
        ImageIO.write(th, format, new File(to));
    }
    
    /* Using Affine transform
     * for transform with power(0.5, etc.). fastest.
     * @param from the path of the original image
     * @param to the path of the target thumbnail
     * @param power to rescale(0.25, 0.5...)
     */
    public void resizeWithAffineTransform(String from, String to, double  power) throws IOException {
        BufferedImage image = ImageIO.read(new File(from));
        int w = image.getWidth();
        int h = image.getHeight();
        BufferedImage th = new BufferedImage((int)(w*power), (int)(h*power), image.getType());
        double powerW = thumbWidth / w;
        double powerH = thumbHeight / h;
        AffineTransformOp op = new AffineTransformOp(AffineTransform.getScaleInstance(power, power),
                AffineTransformOp.TYPE_BILINEAR);
        op.filter(image, th);
        ImageIO.write(th, format, new File(to));
    }
    
    /* setting the target file format
     * @param format specifying the image format, such as "jpg"
     */
    public void setFileFormat(String format) {
        this.format = format;
    }
}
