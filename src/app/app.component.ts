import { Component, Signal, computed, effect, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  writableSignal = signal({ value: 0, isActive: true });
  computedSignal = computed(() => {
    if (this.writableSignal().isActive) return this.writableSignal().value * 2;
    return 0;
  });

  obs$ = new BehaviorSubject<{ value: number, isActive: boolean }>({ value: 0, isActive: true });
  computedObs$ = this.obs$.pipe(map(x => {
    if (x.isActive) return x.value * 2;
    return 0;
  }));

  computedSignalToObs$!: Observable<number>;
  obsToSignal = this.writableSignal.asReadonly();

  constructor() {
    effect(() => {
      console.log(`Writable signal value * Double computed signal value = ${this.writableSignal().value * this.computedSignal()}`);
    });

    this.obsToSignal = toSignal(this.obs$) as Signal<{ value: number, isActive: boolean }>;
    this.computedSignalToObs$ = toObservable(this.computedSignal);
  }

  changeSignalValue(event: any) {
    this.writableSignal.set({ value: event.target.value, isActive: true });
    this.obs$.next({ value: event.target.value, isActive: true });
  }

  substractSignalValue() {
    this.writableSignal.update(x => { return { value: x.value - 1, isActive: true } });
    this.obs$.next({ value: this.obs$.getValue().value - 1, isActive: true });
  }

  enableDisableSignal() {
    this.writableSignal.mutate(x => x.isActive = !x.isActive);
    this.obs$.next({ ...this.obs$.getValue(), isActive: !this.obs$.getValue().isActive });

  }
}
