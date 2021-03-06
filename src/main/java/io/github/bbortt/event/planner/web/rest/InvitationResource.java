package io.github.bbortt.event.planner.web.rest;

import io.github.bbortt.event.planner.domain.Invitation;
import io.github.bbortt.event.planner.repository.RoleRepository;
import io.github.bbortt.event.planner.security.AuthoritiesConstants;
import io.github.bbortt.event.planner.security.RolesConstants;
import io.github.bbortt.event.planner.service.InvitationService;
import io.github.bbortt.event.planner.service.MailService;
import io.github.bbortt.event.planner.service.ProjectService;
import io.github.bbortt.event.planner.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * REST controller for managing {@link io.github.bbortt.event.planner.domain.Invitation}.
 */
@RestController
@RequestMapping("/api")
public class InvitationResource {

    private final Logger log = LoggerFactory.getLogger(InvitationResource.class);

    private static final String ENTITY_NAME = "invitation";

    private final InvitationService invitationService;
    private final ProjectService projectService;
    private final MailService mailService;

    private final RoleRepository roleRepository;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public InvitationResource(
        InvitationService invitationService,
        ProjectService projectService,
        MailService mailService,
        RoleRepository roleRepository
    ) {
        this.invitationService = invitationService;
        this.projectService = projectService;
        this.mailService = mailService;
        this.roleRepository = roleRepository;
    }

    /**
     * {@code POST  /invitations} : Create a new invitation.
     *
     * @param invitation the invitation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new invitation, or with status {@code 400 (Bad Request)} if the invitation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/invitations")
    @PreAuthorize(
        "@projectService.hasAccessToProject(#invitation.project, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")"
    )
    public ResponseEntity<Invitation> createInvitation(@Valid @RequestBody Invitation invitation) throws URISyntaxException {
        log.debug("REST request to save Invitation : {}", invitation);
        if (invitation.getId() != null) {
            throw new BadRequestAlertException("A new invitation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (invitation.getRole().equals(roleRepository.roleAdmin())) {
            throw new BadRequestAlertException("Cannot invite a second project administrator", ENTITY_NAME, "badRequest");
        }
        invitation.setToken(UUID.randomUUID().toString());
        Invitation result = invitationService.save(invitation);

        mailService.sendInvitationMail(invitation);

        return ResponseEntity
            .created(new URI("/api/invitations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /invitations} : Updates an existing invitation.
     *
     * @param invitation the invitation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated invitation, or with status {@code 400 (Bad Request)} if the invitation is not valid, or with status {@code 500 (Internal Server Error)} if the invitation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/invitations")
    @PreAuthorize(
        "@projectService.hasAccessToProject(#invitation.project, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")"
    )
    public ResponseEntity<Invitation> updateInvitation(@Valid @RequestBody Invitation invitation) throws URISyntaxException {
        log.debug("REST request to update Invitation : {}", invitation);
        if (invitation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Invitation result = invitationService.save(invitation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, invitation.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /invitations} : get all the invitations.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of invitations in body.
     */
    @GetMapping("/invitations")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<Invitation>> getAllInvitations(Pageable pageable) {
        log.debug("REST request to get a page of Invitations");
        Page<Invitation> page = invitationService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /invitations/:id} : get the "id" invitation.
     *
     * @param id the id of the invitation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the invitation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/invitations/{id}")
    @PreAuthorize("@invitationService.hasAccessToInvitation(#id, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<Invitation> getInvitation(@PathVariable Long id) {
        log.debug("REST request to get Invitation : {}", id);
        Optional<Invitation> invitation = invitationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(invitation);
    }

    @GetMapping("/invitations/project/{projectId}")
    @PreAuthorize("@projectService.hasAccessToProject(#projectId, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<List<Invitation>> getInvitationsByProjectId(@PathVariable("projectId") Long projectId, Pageable pageable) {
        Page<Invitation> page = invitationService.findAllByProjectId(projectId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * {@code DELETE  /invitations/:id} : delete the "id" invitation.
     *
     * @param id the id of the invitation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/invitations/{id}")
    @PreAuthorize("@invitationService.hasAccessToInvitation(#id, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<Void> deleteInvitation(@PathVariable Long id) {
        log.debug("REST request to delete Invitation : {}", id);
        invitationService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/invitations/accept")
    public void assignCurrentUserToInvitation(@NotEmpty @RequestBody String token) {
        log.debug("REST request to accept invitation for current user by token : {}", token);
        invitationService.assignCurrentUserToInvitation(token);
    }

    @PostMapping("/invitations/accept/{login}")
    public void assignUserByLoginToInvitation(@NotEmpty @RequestBody String token, @NotEmpty @PathVariable String login) {
        log.debug("REST request to accept invitation for user '{}' by token : {}", login, token);
        invitationService.assignUserByLoginToInvitation(login, token);
    }

    @PostMapping("/invitations/token-validity")
    public boolean checkTokenValidity(@NotEmpty @RequestBody String token) {
        log.debug("REST request to check token validity : {}", token);
        return invitationService.isTokenValid(token);
    }

    /**
     * {@code POST /invitations/project/:projectId/email-exists} : Whether the given email exists in this Project.
     *
     * @param projectId the Project identifier.
     * @param email the value to check.
     * @return true if the value exists.
     */
    @PostMapping("/invitations/project/{projectId}/email-exists")
    @PreAuthorize("@projectService.hasAccessToProject(#projectId, \"" + RolesConstants.ADMIN + "\", \"" + RolesConstants.SECRETARY + "\")")
    public ResponseEntity<Boolean> isEmailExistingInProject(@PathVariable Long projectId, @RequestBody String email) {
        log.debug("REST request to check uniqueness of email '{}' by projectId : {}", email, projectId);
        Boolean isExisting = invitationService.isEmailExistingInProject(projectId, email);
        return ResponseEntity.ok(isExisting);
    }
}
