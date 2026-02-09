import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';

/**
 * PRUEBAS UNITARIAS: HomePage
 * Verifica la correcta creación e inicialización del componente HomePage.
 */
describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Prueba básica: Verifica que el componente se instancia correctamente.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
