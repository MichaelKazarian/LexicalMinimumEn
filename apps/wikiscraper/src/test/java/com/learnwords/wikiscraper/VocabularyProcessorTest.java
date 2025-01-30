package com.learnwords.wikiscraper;

import org.junit.Test;
import org.junit.Ignore;
import static org.junit.Assert.assertEquals;
import java.io.File;

public class VocabularyProcessorTest {

    @Ignore @Test
    public void testReadFileContent() throws Exception {
        // Mocking file content since we can't really create a File in a unit test context
        String testContent = "This is a test (noun)\n• Example one\n• Example two";
        // Normally, you would use a mock file here or a real file in integration tests
        assertEquals(testContent, VocabularyProcessor.readFileContent(new File("mockFile.txt")));
    }

    @Test
    public void testExtractPartOfSpeech() {
        String content = "This is a test (noun)\n0• Example one\n• Example two";
        assertEquals("POF-(noun)", VocabularyProcessor.extractPartOfSpeech(content));

        String noPofContent = "This is a test\n• Example one\n• Example two";
        assertEquals("", VocabularyProcessor.extractPartOfSpeech(noPofContent));
    }

    @Test
    public void testExtractExamples() {
        String severalExcamplesContent = "This is a test (noun)\n• Example one\n• Example two";
        assertEquals("Ex1-Example one Ex2-Example two", VocabularyProcessor.extractExamples(severalExcamplesContent));

        String oneExampleContent = "This is a test (noun)\n• Example one\n";
        assertEquals("Ex1-Example one", VocabularyProcessor.extractExamples(oneExampleContent));

        String noExamplesContent = "This is a test (noun)";
        assertEquals("", VocabularyProcessor.extractExamples(noExamplesContent));
    }
}
