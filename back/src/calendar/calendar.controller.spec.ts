import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('CalendarController', () => {
  let controller: CalendarController;
  let service: CalendarService;

  const mockCalendarService = {
    generateSlots: jest.fn(),
    getSlots: jest.fn(),
    getAppointmentsForDoctor: jest.fn(),
    getAvailableSlotsForDoctor: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        { provide: CalendarService, useValue: mockCalendarService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();
  
    controller = module.get<CalendarController>(CalendarController);
  });

  it('should call calendarService.generateSlots and return its result', async () => {
    const result = { message: 'Slots generated' };
    mockCalendarService.generateSlots.mockResolvedValue(result);
  
    expect(await controller.generateSlots()).toBe(result);
    expect(mockCalendarService.generateSlots).toHaveBeenCalledTimes(1);
  });

  it('should return slots by calling calendarService.getSlots', async () => {
    const slots = [{ id: 1 }];
    mockCalendarService.getSlots.mockResolvedValue(slots);
  
    expect(await controller.getSlots()).toBe(slots);
    expect(mockCalendarService.getSlots).toHaveBeenCalledTimes(1);
  });

  it('should return doctor appointments using correct doctorUserId', async () => {
    const doctorUserId = 42;
    const appointments = [{ id: 123 }];
    mockCalendarService.getAppointmentsForDoctor.mockResolvedValue(appointments);
  
    expect(await controller.getDoctorAppointments(doctorUserId)).toBe(appointments);
    expect(mockCalendarService.getAppointmentsForDoctor).toHaveBeenCalledWith(doctorUserId);
  });

  it('should return available slots for doctor using correct doctorUserId', async () => {
    const doctorUserId = 10;
    const slots = [{ slot: '9:00AM' }];
    mockCalendarService.getAvailableSlotsForDoctor.mockResolvedValue(slots);
  
    expect(await controller.getDoctorAvailableSlots(doctorUserId)).toBe(slots);
    expect(mockCalendarService.getAvailableSlotsForDoctor).toHaveBeenCalledWith(doctorUserId);
  });


});
