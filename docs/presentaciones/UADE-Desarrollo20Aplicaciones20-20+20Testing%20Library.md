# UADE-Desarrollo de Aplicaciones 1 - Jest + React Testing Library

> Convertido desde: `UADE-Desarrollo de Aplicaciones 1 - Jest + React Testing Library.pdf`
> Páginas: 19

## Página 1 - UADE

DESARROLLO DE APLICACIONES I

                      Apuntes de Clase

Jest + React Testing Library

                       Profesor: Lic. Adrian Caceres


---

## Página 2 - Contenidos de la clase

Parte 1 - Jest                                         Parte 2 - React Testing Library

                                                    * ¿Qué es React Testing Library?
 * ¿Qué es Jest?
                                                    * Comparación con Espresso
 * Comparación con JUnit (Kotlin)
                                                    * render + screen
 * Instalación y configuración
                                                    * Queries principales
 * describe / it / expect
                                                    * fireEvent — interacciones
 * Matchers principales
                                                    * waitFor — testing asíncrono
 * Mocks — jest.fn() y jest.mock()
                                                    * Componente completo testeado
 * Ejercicios
                                                    * Ejercicios


---

## Página 3 - Parte 1

Jest


---

## Página 4 - ¿Qué es Jest?

Jest es el framework de testing de JavaScript incluido en Expo. Es el equivalente a JUnit en el mundo Android/Kotlin.

 Comparación con Kotlin / JUnit                               Cuándo usar Jest

  Jest (React Native)                   JUnit (Android/Kotlin)
                                                                OK    Testear funciones puras (utils, formatters)

  describe() / it()                         class Test + @Test
                                                                OK     Verificar lógica de negocio sin UI

  expect().toBe()                       assertEquals()
                                                                OK    Testear hooks con testing-library/react-hooks

  jest.fn() — mocks             @Mock / Mockito
                                                                OK    Mockear APIs o módulos externos

  jest.mock('módulo')             @MockBean / mockStatic
                                                           NO    Tests de navegación real entre pantallas

  beforeEach / afterEach            @Before / @After
                                                           NO    Tests de apariencia visual (usar snapshots con cautela)
 npx jest                            ./gradlew test

   Regla práctica: Jest para lógica pura, React Testing Library para componentes. Los dos trabajan juntos — Jest es el runner, RTL provee las
    utilidades de render.


---

## Página 5 - Instalación y configuración de Jest

Expo incluye Jest preconfigurado. Solo se necesita el preset correcto y los scripts en package.json.

  Instalación + package.json                                       Primer test — __tests__/suma.test.ts

    // Expo ya incluye jest-expo. Verificar:                                 // utils/suma.ts
    cat package.json | grep jest                                             export function suma(a: number, b: number) {
                                                                               return a + b;
    // Si falta:                                                             }
    npx expo install jest-expo --save-dev
                                                                            // __tests__/suma.test.ts
    {                                                                        import { suma } from '../utils/suma';
      "scripts": {
        "test": "jest",                                                      describe('suma', () => {
        "test:watch": "jest --watchAll"                                        it('suma dos positivos', () => {
      },                                                                         expect(suma(2, 3)).toBe(5);
      "jest": {                                                                });
        "preset": "jest-expo"                                                  it('suma con negativo', () => {
        // transformIgnorePatterns                                               expect(suma(-1, 1)).toBe(0);
        // ya configurado por Expo                                             });
      }                                                                      });
    }
                                                                            // npm run test → ✓suma dos positivos

   Convención de nombres: Jest detecta automáticamente __tests__/*.ts y *.test.ts. No hace falta registrar los archivos manualmente.


---

## Página 6 - Estructura de un test — describe / it / expect

Un test describe una situación y verifica el resultado esperado. Mismo patrón que JUnit con @Test.

  Estructura básica (Arrange / Act / Assert)                        Comparación con Kotlin / JUnit

    describe('NombreDelModulo', () => {                                      // JUnit (Kotlin)
      beforeEach(() => {                                                     @Test
        // Ejecuta antes de cada test                                        fun `suma dos positivos`() {
      });                                                                      val a = 2; val b = 3
                                                                               val result = suma(a, b)
      it('debería hacer X cuando Y', () => {                                   assertEquals(5, result)
        // Arrange                                                           }
        const input = 'hola';
        // Act                                                               // Jest — equivalente:
        const result = procesar(input);                                      it('suma dos positivos', () => {
        // Assert                                                              const a = 2, b = 3;
        expect(result).toBe('HOLA');                                           const result = suma(a, b);
      });                                                                      expect(result).toBe(5);
                                                                             });
      it('null con entrada vacía', () => {
        expect(procesar('')).toBeNull();                                     // Ventaja: sin clases, sin @Test,
      });                                                                    // nombres descriptivos con espacios
    });

   Patrón AAA: Arrange (preparar datos), Act (ejecutar la función), Assert (verificar). Es el mismo patrón que en JUnit. Los nombres descriptivos
   en it() ayudan a entender qué falló.


---

## Página 7 - Matchers principales

Los matchers son los métodos de expect() que verifican el resultado. Jest tiene más de 30 matchers integrados.

 Matchers de valores y colecciones                               Matchers de objetos, mocks y errores

    // Igualdad                                                              // Objetos
    expect(2 + 2).toBe(4);          // ===                                   expect(obj).toHaveProperty('key');
    expect(obj).toEqual({ a: 1 });  // deep                                  expect(obj).toMatchObject({ a: 1 });

    // Verdad / falsedad                                                     // Errores
    expect(true).toBeTruthy();                                               expect(() => fn()).toThrow();
    expect(null).toBeFalsy();                                                expect(() => fn()).toThrow('mensaje');
    expect(val).toBeNull();
    expect(val).toBeUndefined();                                             // Mocks (ver slide siguiente)
    expect(val).toBeDefined();                                               expect(mockFn).toHaveBeenCalled();
                                                                             expect(mockFn).toHaveBeenCalledWith(arg);
    // Números                                                               expect(mockFn).toHaveBeenCalledTimes(2);
    expect(n).toBeGreaterThan(3);
    expect(n).toBeLessThanOrEqual(5);                                        // Equivalencias con Kotlin:
    expect(0.1+0.2).toBeCloseTo(0.3);                                        // assertEquals(e,a) → expect(a).toBe(e)
                                                                            // assertTrue(c)     → expect(c).toBeTruthy()
    // Strings y arrays                                                      // assertNotNull(x)  → expect(x).not.toBeNull()
    expect('hola').toContain('ol');                                          // assertThrows {fn} → expect(()=>fn()).toThrow()
    expect([1,2,3]).toContain(2);
    expect(arr).toHaveLength(3);                                             // toBe vs toEqual:
                                                                            // toBe    usa === (misma referencia)
    // Negación — any matcher                                                // toEqual compara estructuralmente
    expect(x).not.toBe(0);toBe vs toEqual: toBe usa === (misma referencia). toEqual compara estructuralmente.// → Para objetosParay arrays:compararsiempreobjetostoEqualy arrays siempre usar toEqual.


---

## Página 8 - Mocks — jest.fn() y jest.mock()

Un mock reemplaza una función o módulo real para controlar su comportamiento y verificar que fue llamado.

  jest.fn() — función mock                                             jest.mock() — módulo completo

    // Crear un mock de función                                              // Mock de AsyncStorage
    const mockCb = jest.fn();                                                jest.mock(
    // Llamar y verificar                                                      '@react-native-async-storage/async-storage',
    mockCb('arg1');                                                            () => ({    setItem: jest.fn(),
    expect(mockCb).toHaveBeenCalled();                                           getItem: jest.fn()
    expect(mockCb).toHaveBeenCalledWith('arg1');                                   .mockResolvedValue('guardado'),
    // Definir valor de retorno                                                  removeItem: jest.fn(),  })  );
    const mockGet = jest.fn()                                                // Mock de expo-sqlite
      .mockReturnValue(42);                                                  jest.mock('expo-sqlite', () => ({
    expect(mockGet()).toBe(42);                                                useSQLiteContext: () => ({
    // Mock async (Promise)                                                      getAllAsync: jest.fn()
    const mockFetch = jest.fn()                                                    .mockResolvedValue([
      .mockResolvedValue({ data: [] });                                              { id:1, task:'Tarea 1', completada:0 }
    const res = await mockFetch();                                                 ]), runAsync: jest.fn() .mockResolvedValue(undefined), }),
    expect(res.data).toHaveLength(0);                                        }));
    // Limpiar entre tests
    beforeEach(() => jest.clearAllMocks());                                  // Los jest.mock() van al inicio
                                                                            // del archivo, antes de describe()

    Regla: Siempre mockear las dependencias externas (AsyncStorage, SQLite, fetch). El test debe ser independiente de la red y del disco.


---

## Página 9 - Ejercicios - Parte 1

1     Crear __tests__/utils.test.ts. Escribir una función formatearFecha(fecha: Date): string y testearlo con describe + tres it().

 2     Agregar un test para filtrarTareas(tareas, completada) usando expect().toHaveLength() y toContainEqual().

        Usar jest.fn() para mockear un callback onGuardar. Verificar con toHaveBeenCalledWith() que se llama con el argumento
 3
         correcto.

       Mockear AsyncStorage con jest.mock(). Escribir un test para guardarPrefs() que verifica que setItem se llama con el JSON
 4
         correcto.

 5     Agregar beforeEach(() => jest.clearAllMocks()) y verificar que los tests son independientes entre sí ejecutando npx jest.


---

## Página 10 - Parte 2

React Testing Library


---

## Página 11 - ¿Qué es React Testing Library?

RTL prueba componentes React renderizándolos como lo haría el usuario — sin depender de la implementación interna.

 RTL vs Espresso (Kotlin)                                     Cuándo usar RTL

 RTL (React Native)                  Espresso (Android)
                                                                OK    Testear que un componente renderiza correctamente

  render(<Componente/>)              ActivityScenario.launch()
                                                                OK     Verificar comportamiento al presionar botones

  screen.getByText('...')                 onView(withText('...'))
                                                                OK    Testear formularios — input + submit

  fireEvent.press(btn)                   perform(click())
                                                                OK     Verificar estados: loading, error, success

  waitFor / findBy*                    IdlingResource
                                                           NO    Tests de navegación (usar Detox para E2E)

  expect(el).toBeTruthy()              check(matches(isDisplayed()))
                                                           NO    Lógica pura sin UI — usar Jest solo
  @testing-library/react-native         androidx.test.espresso

   La diferencia clave: RTL renderiza el componente real y busca elementos por texto o rol — igual que lo haría el usuario, sin acceder al estado
    interno.


---

## Página 12 - Instalación

npx expo install jest-expo jest @types/jest –dev
npx expo install @testing-library/react-native –dev
Agregar en package.json el script y el preset:
{ "scripts": {
  "test": "jest --watchAll"
  },
 "jest": {
  "preset": "jest-expo"
 }}
Como usamos TypeScript, agregar "jest" a types en tsconfig.json:
{ "compilerOptions": {
  "types": ["jest"]
 } }


---

## Página 13 - Primer test

crear __tests__/home-screen-test.tsx

 import { render } from '@testing-library/react-native';
 import HomeScreen from '../screens/HomeScreen';

 const mockNavigation = { navigate: jest.fn() } as any;

 describe('<HomeScreen />', () => {
  test('renderiza correctamente', () => {
   render(<HomeScreen navigation={mockNavigation} />);
   });
 });

 Ejecutar npx jest
 Ejecutar npm run test


---

## Página 14 - render + screen — queries principales

render() monta el componente. screen expone las queries para encontrar elementos en el árbol renderizado.

 Queries por prioridad (recomendado)                            Ejemplo — TareasScreen

                                                                             import { render, screen } from '@testing-library/react-native';
    // 1. Por rol — más semántico                                            import TareasScreen from '../screens/TareasScreen';
    screen.getByRole('button', {name:'Guardar'})                             describe('TareasScreen', () => {
    screen.getByRole('textbox')                                                it('muestra mensaje con lista vacía', () => {
    // 2. Por texto visible                                                      render(<TareasScreen tareas={[]} />);
    screen.getByText('Nueva tarea')                                              expect(screen.getByText('No hay tareas todavía')).toBeTruthy();
    screen.getByText(/nueva/i)  // regex                                       });
    // 3. Por placeholder                                                      it('muestra las tareas de la lista', () => {
    screen.getByPlaceholderText('Buscar...')                                     const tareas = [
    // 4. Por testID (último recurso)                                              { id:1, task:'Comprar leche', completada:0 },
    screen.getByTestId('lista-tareas')                                             { id:2, task:'Llamar médico',  completada:0 },
    // Variantes:                                                               ];
    // getBy*   — lanza si no encuentra                                          render(<TareasScreen tareas={tareas} />);
    // queryBy* — devuelve null si no existe                                     expect(screen.getByText('Comprar leche'))
    // findBy*  — async, espera que aparezca                                       .toBeTruthy();
    // AllBy — devuelve array de elementos                                       expect(screen.getByText('Llamar médico'))
    screen.getAllByText('Tarea')                                                   .toBeTruthy();
                                                                               });
                                                                             });

   getBy vs queryBy: Usar getBy cuando el elemento DEBE existir (lanza si no). Usar queryBy + .toBeNull() para verificar que algo NO está
    renderizado.


---

## Página 15 - fireEvent — simular interacciones del usuario

fireEvent simula acciones del usuario sobre los elementos encontrados por screen.

 Métodos de fireEvent                                              Test completo — AgregarTareaForm

    import { render, screen, fireEvent }                                     describe('AgregarTareaForm', () => {
      from '@testing-library/react-native';                                    it('llama onAgregar con el texto', () => {
                                                                                 const mockOnAgregar = jest.fn();
    // Presionar un botón                                                        render(
    fireEvent.press(screen.getByText('Agregar'));                                  <AgregarTareaForm onAgregar={mockOnAgregar}/>
                                                                                );
    // Escribir en un TextInput                                                  fireEvent.changeText(
    fireEvent.changeText(                                                          screen.getByPlaceholderText('Nueva tarea...'),
      screen.getByPlaceholderText('Nueva tarea...'),                               'Hacer ejercicio'
      'Hacer ejercicio'                                                         );
    );                                                                           fireEvent.press(screen.getByText('+'));
                                                                                 expect(mockOnAgregar)
    // Evento personalizado                                                        .toHaveBeenCalledWith('Hacer ejercicio');
    fireEvent(screen.getByTestId('slider'),                                    });
      'onValueChange', 0.7);                                                 });

   Patrón con mocks: Crear jest.fn() para los callbacks → simular acciones con fireEvent → verificar con toHaveBeenCalledWith(). Es el patrón
   más frecuente en RTL.


---

## Página 16 - waitFor — testing asíncrono

Para código asíncrono (SQLite, AsyncStorage, fetch) usar waitFor o las variantes findBy* de screen.

 waitFor — esperar condición asíncrona                             findBy* — query asíncrona (shortcut)

    import { render, screen, waitFor }                                       // findBy* = waitFor + getBy* combinados
      from '@testing-library/react-native';                                  // Más conciso para encontrar un elemento
    it('muestra tareas después de cargar', async () => {                     it('muestra tareas con findByText', async () => {
      // Mock de la BD                                                         jest.spyOn(db, 'getAllAsync')
      jest.spyOn(db, 'getAllAsync')                                              .mockResolvedValue([{ id:1, task:'Tarea 1', completada:0 }]);
        .mockResolvedValue([{id:1,task:'Tarea 1',completada:0}]);              render(<TareasLocalScreen />);
      render(<TareasLocalScreen />);                                           // Espera automáticamente hasta que aparezca
    // Antes de la carga: no aparece                                           const el = await screen.findByText('Tarea 1');
      expect(screen.queryByText('Tarea 1')).toBeNull();                        expect(el).toBeTruthy();
      // Esperar a que aparezca                                              });
      await waitFor(() => {                                                  // Cuándo usar cada uno:
        expect(screen.getByText('Tarea 1'))                                  // findBy*  → buscar un elemento específico
          .toBeTruthy();                                                     // waitFor  → verificar múltiples condiciones
      });                                                                    // También existe findAllBy* para listas:
    });                                                                     // const items = await screen.findAllByText(
                                                                            //   /tarea/i
    // Timeout personalizado:                                                // );
    // waitFor(() => {...}, { timeout: 3000 })                               // expect(items).toHaveLength(3);

   Regla async: Siempre usar async/await con findBy* o waitFor. El test debe esperar el re-render antes de verificar resultados asíncronos.


---

## Página 17 - TareaItem — componente completo testeado

Ejemplo real: testear un componente con props y callbacks, cubriendo todos los casos de uso.

 components/TareaItem.tsx                                         __tests__/TareaItem.test.tsx

    interface Props {                                                        const tarea = { id:1, task:'Estudiar', completada:0 };
      tarea: TareaLocal;                                                     const mockCompletar = jest.fn(); const mockEliminar  = jest.fn();
      onCompletar: (t: TareaLocal) => void;                                  beforeEach(() => jest.clearAllMocks());
      onEliminar:  (id: number) => void;                                     function renderItem(t = tarea) {
    }                                                                          return render(<TareaItem tarea={t}
    export default function TareaItem(                                           onCompletar={mockCompletar}
      { tarea, onCompletar, onEliminar }: Props                                  onEliminar={mockEliminar} />); }
    ) {  return (                                                            it('muestra el texto de la tarea', () => {
        <View>                                                                 renderItem(); expect(screen.getByText('Estudiar')).toBeTruthy(); });
          <Pressable onPress={()=>onCompletar(tarea)}>                       it('llama onCompletar al presionar [ ]', () => {
            <Text>                                                             renderItem(); fireEvent.press(screen.getByText('[ ]'));
              {tarea.completada ? '[X]' : '[ ]'}                               expect(mockCompletar).toHaveBeenCalledWith(tarea);
            </Text>                                                          });
          </Pressable>                                                       it('llama onEliminar al presionar X', () => {
          <Text style={[styles.tarea,                                          renderItem();
            tarea.completada && styles.tachada]}>                              fireEvent.press(screen.getByText('X'));
            {tarea.task}                                                       expect(mockEliminar).toHaveBeenCalledWith(1);
          </Text>                                                            });
          <Pressable onPress={()=>onEliminar(tarea.id)}>                     it('muestra [X] si completada', () => {
            <Text>X</Text>                                                     renderItem({...tarea, completada:1});
          </Pressable>                                                         expect(screen.getByText('[X]')).toBeTruthy();
        </View>  );}                                                         });


---

## Página 18 - Ejercicios - Parte 2

Crear __tests__/TareaItem.test.tsx. Renderizar el componente con datos de prueba y verificar que muestra el texto con
 1
         screen.getByText().

        Agregar test para completada:1 — verificar que muestra '[X]'. Agregar otro para completada:0 — verificar que muestra '[
 2
              ]'.

        Usar fireEvent.press() sobre el check '[ ]'. Verificar con toHaveBeenCalledWith() que onCompletar recibe la tarea
 3
         correcta.

         Testear AgregarTareaForm: fireEvent.changeText() en el input, fireEvent.press() en '+', luego verificar que el input se
 4
          vació.

        Agregar un test asíncrono con findByText() que mockea getAllAsync y espera a que TareasLocalScreen renderice la lista
 5
         cargada.


---

## Página 19 - Recursos para practicar

Jest — documentación                                              jestjs.io/docs/getting-started
Guía completa + API reference

React Testing Library — react-native                                  testing-library.com/docs/react-native-
                                                                    testing-library
Guía oficial, queries y ejemplos

jest-expo — Expo docs                                               docs.expo.dev/develop/unit-testing
Configuración del preset para proyectos Expo

@testing-library/jest-native                                         github.com/testing-library/jest-native
Matchers adicionales: toBeVisible, toHaveText...

Common mistakes — Kent C. Dodds                                  kentcdodds.com/blog/common-mistakes-with-
                                                                    react-testing-library
Errores frecuentes al usar Testing Library


---
