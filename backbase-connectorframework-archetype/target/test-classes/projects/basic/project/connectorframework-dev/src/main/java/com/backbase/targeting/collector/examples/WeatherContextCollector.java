package com.backbase.targeting.collector.examples;

import com.backbase.portal.targeting.connectorframework.content.agregate.UupAggregator;
import com.backbase.portal.targeting.connectorframework.content.contexts.definition.ContextCollector;
import com.backbase.portal.targeting.connectorframework.content.contexts.definition.PossibleValue;
import com.backbase.portal.targeting.connectorframework.content.contexts.definition.ResultEntries;
import com.backbase.portal.targeting.connectorframework.content.contexts.definition.SegmentDefinition;
import com.backbase.portal.targeting.connectorframework.content.contexts.definition.SelectorDefinition;
import com.backbase.portal.targeting.rulesengine.type.RuleEngineTypes;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Weather context collector. This collector is a show case for creating custom collectors and shouldn't be used in
 * production code.
 */
public class WeatherContextCollector extends ContextCollector {

    private static final String WEATHER = "weather";
    private static final String TEMPERATURE = "temperature";
    private static final String WINDSPEED = "windspeed";
    private static final String HUMIDITY = "humidity";
    private static final String VISIBILITY = "visibility";
    private static final String GOOD = "Good";
    private static final String POOR = "Poor";
    private static final String BAD = "Bad";
    private static final String RAINY = "Rainy";
    private static final String SUNNY = "Sunny";
    private static final String FOGGY = "Foggy";
    public static final String SNOW_DEPTH = "snow_depth";

    @Autowired
    UupAggregator uupAggregator;

    /**
     * {@inheritDoc}
     */
    public List<SelectorDefinition> defineSelectors(String portal, Map<String, String> _) {
        List<SelectorDefinition> selectorDefinitions = new ArrayList<SelectorDefinition>();
        SelectorDefinition selectorTemperature = new SelectorDefinition(TEMPERATURE, RuleEngineTypes.INTEGER, "Temperature").setDescription("Current temperature");
        selectorDefinitions.add(selectorTemperature);

        SelectorDefinition selectorWindSpeed = new SelectorDefinition(WINDSPEED, RuleEngineTypes.INTEGER, "Speed of the wind");
        selectorDefinitions.add(selectorWindSpeed);

        SelectorDefinition selectorHumidity = new SelectorDefinition(HUMIDITY, RuleEngineTypes.INTEGER, "Humidity");
        selectorDefinitions.add(selectorHumidity);

        SelectorDefinition selectorSnowDepth = new SelectorDefinition(SNOW_DEPTH, RuleEngineTypes.RANGE, "Snow Depth");
        selectorSnowDepth.setMin(0).setMax(50).setStep(2);
        selectorDefinitions.add(selectorSnowDepth);

        SelectorDefinition visibility = new SelectorDefinition(VISIBILITY, RuleEngineTypes.ENUM, "Visibility");
        visibility.addPossibleValues(new PossibleValue(GOOD), new PossibleValue(POOR), new PossibleValue(BAD));
        selectorDefinitions.add(visibility);

        return selectorDefinitions;
    }

    /**
     * {@inheritDoc}
     */
    public List<SegmentDefinition> defineSegments(String portal, Map<String, String> _) {
        List<SegmentDefinition> segmentDefinitions = new ArrayList<SegmentDefinition>();
        segmentDefinitions.add(new SegmentDefinition(RAINY, "Rainy weather"));
        segmentDefinitions.add(new SegmentDefinition(SUNNY, "Sunny weather"));
        segmentDefinitions.add(new SegmentDefinition(FOGGY, "Foggy weather"));
        return segmentDefinitions;
    }

    public WeatherContextCollector() {
        super(WEATHER, "Information about weather conditions (*DUMMY COLLECTOR* values that are evaluating to true are: " +
                "Visibility=bad, Temperature=17, Speed Of The Wind=40, Humidity=90, SnowDepth=10 and segment is 'Rainy weather')",
                "$(contextRoot)/static/backbase.com.2012.darts/media/contexts/targeting-context-weather.png",
                "Weather *DUMMY COLLECTOR*");
    }

    /**
     * {@inheritDoc}
     */
    public ResultEntries executeTask(Map<String, String> requestMap, ResultEntries resultEntries) {
        //hard code some data
        resultEntries.addSelectorEntry(VISIBILITY, BAD);
        resultEntries.addSelectorEntry(TEMPERATURE, "17");
        resultEntries.addSelectorEntry(WINDSPEED, "40");
        resultEntries.addSelectorEntry(HUMIDITY, "90");
        resultEntries.addSelectorEntry(SNOW_DEPTH, "10");

        // set segment
        resultEntries.addSegmentEntry(RAINY);

        return resultEntries;
    }

}
