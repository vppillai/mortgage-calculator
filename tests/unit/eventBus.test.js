import { describe, it, expect, beforeEach, vi } from 'vitest';
import EventBus, { EVENTS } from '../../src/utils/eventBus.js';

describe('EventBus', () => {
    beforeEach(() => {
        // Clear all listeners before each test
        EventBus.clear();
    });

    describe('on() - Subscribe to events', () => {
        it('should allow subscribing to events', () => {
            const callback = vi.fn();
            EventBus.on('test-event', callback);

            EventBus.emit('test-event', { data: 'test' });

            expect(callback).toHaveBeenCalledWith({ data: 'test' });
        });

        it('should support multiple subscribers', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            EventBus.on('test-event', callback1);
            EventBus.on('test-event', callback2);

            EventBus.emit('test-event', { data: 'test' });

            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });

        it('should return unsubscribe function', () => {
            const callback = vi.fn();
            const unsubscribe = EventBus.on('test-event', callback);

            EventBus.emit('test-event', { data: 'test1' });
            unsubscribe();
            EventBus.emit('test-event', { data: 'test2' });

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith({ data: 'test1' });
        });

        it('should handle events with no subscribers', () => {
            expect(() => {
                EventBus.emit('nonexistent-event', {});
            }).not.toThrow();
        });
    });

    describe('off() - Unsubscribe from events', () => {
        it('should remove a specific subscriber', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            EventBus.on('test-event', callback1);
            EventBus.on('test-event', callback2);

            EventBus.off('test-event', callback1);
            EventBus.emit('test-event', { data: 'test' });

            expect(callback1).not.toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });

        it('should handle unsubscribing from non-existent event', () => {
            expect(() => {
                EventBus.off('nonexistent-event', vi.fn());
            }).not.toThrow();
        });
    });

    describe('once() - Subscribe once', () => {
        it('should call callback only once', () => {
            const callback = vi.fn();
            EventBus.once('test-event', callback);

            EventBus.emit('test-event', { data: 'test1' });
            EventBus.emit('test-event', { data: 'test2' });

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith({ data: 'test1' });
        });
    });

    describe('emit() - Emit events', () => {
        it('should pass data to subscribers', () => {
            const callback = vi.fn();
            EventBus.on('test-event', callback);

            const testData = { key: 'value', number: 42 };
            EventBus.emit('test-event', testData);

            expect(callback).toHaveBeenCalledWith(testData);
        });

        it('should handle errors in callbacks gracefully', () => {
            const errorCallback = vi.fn(() => {
                throw new Error('Callback error');
            });
            const normalCallback = vi.fn();

            EventBus.on('test-event', errorCallback);
            EventBus.on('test-event', normalCallback);

            // Should not throw
            expect(() => {
                EventBus.emit('test-event', {});
            }).not.toThrow();

            expect(normalCallback).toHaveBeenCalled();
        });

        it('should call all subscribers even if one throws', () => {
            const errorCallback = vi.fn(() => {
                throw new Error('Callback error');
            });
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            EventBus.on('test-event', errorCallback);
            EventBus.on('test-event', callback1);
            EventBus.on('test-event', callback2);

            EventBus.emit('test-event', { data: 'test' });

            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });
    });

    describe('clear() - Clear all listeners', () => {
        it('should remove all event listeners', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            EventBus.on('event1', callback1);
            EventBus.on('event2', callback2);

            EventBus.clear();

            EventBus.emit('event1', {});
            EventBus.emit('event2', {});

            expect(callback1).not.toHaveBeenCalled();
            expect(callback2).not.toHaveBeenCalled();
        });
    });

    describe('listenerCount() - Get subscriber count', () => {
        it('should return correct count of subscribers', () => {
            expect(EventBus.listenerCount('test-event')).toBe(0);

            EventBus.on('test-event', vi.fn());
            expect(EventBus.listenerCount('test-event')).toBe(1);

            EventBus.on('test-event', vi.fn());
            expect(EventBus.listenerCount('test-event')).toBe(2);
        });

        it('should return 0 for non-existent events', () => {
            expect(EventBus.listenerCount('nonexistent-event')).toBe(0);
        });
    });

    describe('EVENTS constants', () => {
        it('should export event name constants', () => {
            expect(EVENTS.CALCULATION_COMPLETE).toBe('calculation:complete');
            expect(EVENTS.THEME_CHANGED).toBe('theme:changed');
            expect(EVENTS.ERROR_OCCURRED).toBe('error:occurred');
            expect(EVENTS.NOTIFICATION).toBe('notification:show');
        });
    });
});

