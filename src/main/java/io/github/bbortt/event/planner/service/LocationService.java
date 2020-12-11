package io.github.bbortt.event.planner.service;

import io.github.bbortt.event.planner.domain.Location;
import io.github.bbortt.event.planner.repository.LocationRepository;
import io.github.bbortt.event.planner.repository.SectionRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Location}.
 */
@Service
@Transactional
public class LocationService {

    private final Logger log = LoggerFactory.getLogger(LocationService.class);

    private final LocationRepository locationRepository;
    private final SectionRepository sectionRepository;

    public LocationService(LocationRepository locationRepository, SectionRepository sectionRepository) {
        this.locationRepository = locationRepository;
        this.sectionRepository = sectionRepository;
    }

    /**
     * Save a location.
     *
     * @param location the entity to save.
     * @return the persisted entity.
     */
    public Location save(Location location) {
        log.debug("Request to save Location : {}", location);
        return locationRepository.save(location);
    }

    /**
     * Get all the locations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Location> findAll(Pageable pageable) {
        log.debug("Request to get all Locations");
        return locationRepository.findAll(pageable);
    }

    /**
     * Get one location by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Location> findOne(Long id) {
        log.debug("Request to get Location : {}", id);
        return locationRepository.findById(id);
    }

    /**
     * Delete the location by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Location : {}", id);
        locationRepository.deleteById(id);
    }

    /**
     * Find all Locations for the given project.
     *
     * @param projectId the project to retrieve locations for.
     * @param pageable  the pagination information.
     * @return the list of entities.
     */
    public Page<Location> findAllByProjectId(Long projectId, Pageable pageable) {
        log.debug("Request to get all Locations for Project {}", projectId);
        return locationRepository.findAllByProjectId(projectId, pageable).map(this::fetchSections);
    }

    /**
     * Resolve section entity graph based on given location.
     *
     * @param location the location.
     * @return the enriched location.
     */
    private Location fetchSections(Location location) {
        log.debug("Enrich location {} with sections", location.getId());
        location.sections(sectionRepository.findAllByLocationId(location.getId()));
        return location;
    }
}
