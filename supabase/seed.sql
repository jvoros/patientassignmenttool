insert into
public.shift_types (shift_type)
values
('physician'),
('app');

insert into
public.provider_roles (role)
values
('physician'),
('app');

insert into
public.patient_types (patient_type)
values
('walk in'),
('fast track'),
('ambulance');

insert into
public.event_types (event_type)
values
('board'),
('addShift'),
('addPatient'),
('reassignPatient'),
('flexOn'),
('flexOff'),
('joinFt'),
('leaveFt'),
('signOut'),
('rejoin');

insert into
public.shift_details (name, start_time, end_time, bonus, shift_type)
values
('6a - 3p', '06:00:00', '15:00:00', 2, 'physician'),
('APP 6a - 3p', '06:00:00', '15:00:00', 0, 'app'),
('8a - 5p', '08:00:00', '17:00:00', 2, 'physician'),
('11a - 8p', '11:00:00', '20:00:00', 2, 'physician'),
('3p - 11p', '15:00:00', '23:00:00', 2, 'physician'),
('APP 3p - Mid', '15:00:00', '00:00:00', 0, 'app'),
('5p - 1a', '17:00:00', '01:00:00', 2, 'physician'),
('APP 8p - 3a', '15:00:00', '00:00:00', 0, 'app'),
('11p - 6a', '23:00:00', '06:00:00', 2, 'physician');

insert into
public.providers (lname, fname, role )
values
('Voros', 'Jeremy', 'physician'),
('Blake', 'Kelly', 'physician'),
('Stiles', 'Adam', 'physician'),
('Cheever', 'Shelley', 'app'),
('Lempit', 'Hilary', 'app');

insert into
public.shifts (info_id, provider_id)
values
(1, 1),
(2, 4),
(3, 3),
(6, 5);

insert into
public.patients (room, shift_id, supervisor_id, patient_type)
values
('1', 1, null,'walk in'),
('Tr A', 2, 1, 'fast track');

insert into
public.events(created_at, previous_event, message, detail, event_type, shift_id, patient_id, state)
values
('2024-09-09 08:58:00', 0, 'Board reset.', null, 'board', null, null, '{"main":[1, 3],"flex":[2, 4],"off":[],"events":[1],"nextFt":2,"nextProvider":1,"nextSupervisor":1}'),
('2024-09-09 08:58:10', 1, 'assigned to', null, 'addPatient', 1, 1, '{"main":[1, 3],"flex":[2, 4],"off":[],"events":[2, 1],"nextFt":2,"nextProvider":1,"nextSupervisor":1}'),
('2024-09-09 08:58:20', 2, 'assigned to', 'supervised by', 'addPatient', 2, 2, '{"main":[1, 3],"flex":[2, 4],"off":[],"events":[3, 2, 1],"nextFt":2,"nextProvider":1,"nextSupervisor":2}');
