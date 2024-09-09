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
('reassignPatient');

insert into
public.events(previous_event, message, event_type, state)
values
(0, 'Board reset.', 'board','{"main":[1, 3],"flex":[2, 4],"off":[],"events":[1],"ft":2,"next":1,"super":1}');

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
(6, 5)