package io.github.bbortt.event.planner.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

/**
 * A Location.
 */
@Entity
@Table(
    name = "location",
    uniqueConstraints = { @UniqueConstraint(name = "unique_location_per_project", columnNames = { "name", "project_id" }) }
)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Location implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(
        name = "location_id_seq",
        strategy = PostgreSQLConstants.SEQUENCE_GENERATOR_STRATEGY,
        parameters = { @Parameter(name = "sequence_name", value = "location_id_seq"), @Parameter(name = "increment_size", value = "1") }
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "location_id_seq")
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @NotNull
    @Column(name = "date_from", nullable = false)
    private ZonedDateTime dateFrom;

    @NotNull
    @Column(name = "date_to", nullable = false)
    private ZonedDateTime dateTo;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "locations", allowSetters = true)
    private Project project;

    @ManyToOne
    @JsonIgnoreProperties(value = "locations", allowSetters = true)
    private Responsibility responsibility;

    @OneToMany(mappedBy = "location")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Section> sections = new HashSet<>();

    @OneToMany(mappedBy = "location")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<LocationTimeSlot> locationTimeSlots = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Location name(String name) {
        this.name = name;
        return this;
    }

    public ZonedDateTime getDateFrom() {
        return dateFrom;
    }

    public void setDateFrom(ZonedDateTime dateFrom) {
        this.dateFrom = dateFrom;
    }

    public Location dateFrom(ZonedDateTime dateFrom) {
        this.dateFrom = dateFrom;
        return this;
    }

    public ZonedDateTime getDateTo() {
        return dateTo;
    }

    public void setDateTo(ZonedDateTime dateTo) {
        this.dateTo = dateTo;
    }

    public Location dateTo(ZonedDateTime dateTo) {
        this.dateTo = dateTo;
        return this;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Location project(Project project) {
        this.project = project;
        return this;
    }

    public Responsibility getResponsibility() {
        return responsibility;
    }

    public void setResponsibility(Responsibility responsibility) {
        this.responsibility = responsibility;
    }

    public Location responsibility(Responsibility responsibility) {
        this.responsibility = responsibility;
        return this;
    }

    public Set<Section> getSections() {
        return sections;
    }

    public void setSections(Set<Section> sections) {
        this.sections = sections;
    }

    public Location sections(Set<Section> sections) {
        this.sections = sections;
        return this;
    }

    public Location addSection(Section section) {
        this.sections.add(section);
        section.setLocation(this);
        return this;
    }

    public Location removeSection(Section section) {
        this.sections.remove(section);
        section.setLocation(null);
        return this;
    }

    public Set<LocationTimeSlot> getLocationTimeSlots() {
        return locationTimeSlots;
    }

    public void setLocationTimeSlots(Set<LocationTimeSlot> locationTimeSlots) {
        this.locationTimeSlots = locationTimeSlots;
    }

    public Location addLocationTimeSlot(LocationTimeSlot locationTimeSlot) {
        this.locationTimeSlots.add(locationTimeSlot);
        locationTimeSlot.setLocation(this);
        return this;
    }

    public Location removeLocationTimeSlot(LocationTimeSlot locationTimeSlot) {
        this.locationTimeSlots.remove(locationTimeSlot);
        locationTimeSlot.setLocation(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Location)) {
            return false;
        }
        return id != null && id.equals(((Location) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Location{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", dateFrom='" + getDateFrom() + "'" +
            ", dateTo='" + getDateTo() + "'" +
            "}";
    }
}