package com.learnwords.wikiscraper;

import java.io.*;
import java.nio.file.*;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class VocabularyProcessor {
    
    public static void main(String[] args) {
        String rootPath = "../../generated"; // Path to the root directory
        processDirectory(new File(rootPath));
    }

    private static void processDirectory(File dir) {
        if (dir.isDirectory()) {
            // Sort files alphabetically
            File[] files = dir.listFiles();
            if (files != null) {
                Arrays.sort(files, (f1, f2) -> f1.getName().compareToIgnoreCase(f2.getName()));

                for (File file : files) {
                    if (file.isDirectory() && !file.getName().startsWith("-")) {
                        processDirectory(file); // Recursively process subdirectories
                    } else if (file.getName().endsWith(".txt")) {
                        processFile(file);
                    }
                }
            }
        }
    }

    private static void processFile(File file) {
        try {
            String fileName = file.getName().replace(".txt", "");
            String partWord = "W-" + fileName;
            
            String content = new String(Files.readAllBytes(Paths.get(file.toURI())));
            
            // Check for part of speech in parentheses
            Pattern pofPattern = Pattern.compile("\\((.*?)\\)");
            Matcher matcher = pofPattern.matcher(content);
            String partPof = "";
            if (matcher.find()) {
                partPof = "POF-" + matcher.group(0);
            }
            
            // Check for examples marked with bullet points
            StringBuilder partExample = new StringBuilder();
            int exampleNumber = 1;
            Pattern examplePattern = Pattern.compile("•\\s*(.+?)(?=(?:•|$))");
            matcher = examplePattern.matcher(content);
            while (matcher.find()) {
                partExample.append("Ex").append(exampleNumber).append("-").append(matcher.group(1).trim()).append(" ");
                exampleNumber++;
            }
            
            System.out.println(String.format("%s %s %s", partWord, partPof, partExample)); 
        } catch (IOException e) {
            System.err.println("Error processing file: " + file.getName() + " - " + e.getMessage());
        }
    }
}
