# Guía de Mejores Prácticas Git para ProyectoFruitExplorer

## 🎯 Plan de Acción Inmediato

### 1. Configurar Git Correctamente

#### Para Diego:
```bash
git config --global user.name "Diego Lezama"
git config --global user.email "diegolezama008@gmail.com"
```

#### Para Carlos:
```bash
git config --global user.name "Carlos Hernandez"
git config --global user.email "905953@senati.pe"
```

#### Para Dennis:
```bash
git config --global user.name "Dennis"
git config --global user.email "albondigo413@gmail.com"
```

---

### 2. Actualizar .gitignore

Crear/actualizar el archivo `.gitignore` en la raíz del proyecto:

```gitignore
# IDEs
.idea/
.vscode/
*.iml
*.swp
*.swo
*~

# Node.js
node_modules/
npm-debug.log
yarn-error.log
.env
.env.local
.env.*.local

# Android
*.apk
*.ap_
*.dex
*.class
bin/
gen/
out/
.gradle/
build/
captures/
.externalNativeBuild/
.cxx/
local.properties

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Databases
*.db
*.sqlite
*.sqlite3

# Temporal
*.tmp
*.temp
.cache/
```

Ejecutar después:
```bash
git rm -r --cached .idea/
git commit -m "chore: remove IDE files from repository"
```

---

### 3. Mensajes de Commit - Conventional Commits

#### Formato:
```
<tipo>(<alcance>): <descripción corta>

<descripción detallada opcional>

<footer opcional>
```

#### Tipos principales:

- **feat**: Nueva funcionalidad
- **fix**: Corrección de bug
- **refactor**: Refactorización de código
- **docs**: Documentación
- **style**: Formato, punto y coma faltantes, etc.
- **test**: Agregar o modificar tests
- **chore**: Tareas de mantenimiento

#### Ejemplos BUENOS:

```bash
# En lugar de "hola"
git commit -m "feat(web): implementar panel de administración con CRUD de frutas

- Agregar páginas de login y registro
- Implementar gestión de usuarios (solo admin)
- Crear servicios de API para frutas
- Configurar Context API para autenticación
- Agregar React Router para navegación"

# En lugar de "nd"
git commit -m "fix(android): corregir crash al cargar regiones sin conexión"

# En lugar de "mas cambios"
git commit -m "feat(android): agregar módulo de recetas con detalle completo"

# En lugar de "algunos cambios"
git commit -m "refactor(android): mejorar FruitAnalyzer con procesamiento de lotes"
```

---

### 4. Estrategia de Branching

#### Crear estructura de ramas:

```bash
# Crear rama principal
git checkout -b main
git push -u origin main

# Crear rama de desarrollo
git checkout -b develop
git push -u origin develop

# Para nuevas funcionalidades
git checkout -b feature/nombre-funcionalidad develop

# Para correcciones
git checkout -b fix/descripcion-bug develop

# Para releases
git checkout -b release/v1.0.0 develop
```

#### Workflow recomendado:

```
main (producción)
  ↑
  └─ release/v1.0.0
       ↑
       └─ develop (integración)
            ↑
            ├─ feature/user-profile
            ├─ feature/fruit-filter
            └─ fix/camera-permissions
```

---

### 5. Commits Atómicos

❌ **MAL:** Un commit con 4,331 líneas
```bash
git add .
git commit -m "hola"
```

✅ **BIEN:** Dividir en commits lógicos
```bash
# Commit 1
git add frontend-APP/src/services/*
git commit -m "feat(web): agregar servicios de API para autenticación y frutas"

# Commit 2
git add frontend-APP/src/pages/AddFruit.jsx frontend-APP/src/pages/EditFruit.jsx
git commit -m "feat(web): implementar formularios de creación y edición de frutas"

# Commit 3
git add frontend-APP/src/pages/UsersPage.jsx
git commit -m "feat(web): agregar página de gestión de usuarios para admin"

# Commit 4
git add frontend-APP/src/context/AuthContext.jsx frontend-APP/src/login.jsx frontend-APP/src/register.jsx
git commit -m "feat(web): implementar sistema de autenticación con Context API"

# Commit 5
git add frontend-APP/package*.json
git commit -m "chore(web): agregar dependencias de React Router y Vite"
```

---

### 6. Configurar Hooks de Git

#### Pre-commit Hook
Crear archivo `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Validar que no se commiteen archivos .idea
if git diff --cached --name-only | grep -q "^\.idea/"; then
    echo "❌ Error: No se pueden commitear archivos .idea/"
    echo "Agrégalos al .gitignore"
    exit 1
fi

# Validar longitud del mensaje
commit_msg_file=$(git rev-parse --git-dir)/COMMIT_EDITMSG
if [ -f "$commit_msg_file" ]; then
    msg=$(cat "$commit_msg_file")
    if [ ${#msg} -lt 10 ]; then
        echo "❌ Error: El mensaje de commit debe tener al menos 10 caracteres"
        exit 1
    fi
fi

echo "✅ Pre-commit checks passed"
exit 0
```

Hacer ejecutable:
```bash
chmod +x .git/hooks/pre-commit
```

---

### 7. Template de Commit Message

Crear archivo `.gitmessage`:

```
# <tipo>(<alcance>): <descripción corta en presente>
# |<----  Máximo 50 caracteres  ---->|

# Explicación detallada del cambio (opcional)
# |<----  Máximo 72 caracteres por línea  ---->|

# Referencias a issues (opcional)
# Fixes #123
# Closes #456

# --- COMMIT END ---
# Tipos permitidos:
#   feat:     Nueva funcionalidad
#   fix:      Corrección de bug
#   refactor: Refactorización (sin cambiar funcionalidad)
#   docs:     Cambios en documentación
#   style:    Formato, espacios, etc (sin cambiar lógica)
#   test:     Agregar o modificar tests
#   chore:    Mantenimiento (actualizar dependencias, etc)
#   perf:     Mejora de performance
#
# Alcances sugeridos: web, android, backend, db, ml
#
# Recuerda:
#   - Usar modo imperativo ("agregar" no "agregado")
#   - No terminar con punto
#   - Separar título de cuerpo con línea en blanco
# --------------------
```

Configurar:
```bash
git config --global commit.template .gitmessage
```

---

### 8. Alias Útiles de Git

Agregar al `~/.gitconfig`:

```bash
[alias]
    # Logs mejorados
    lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

    # Status corto
    st = status -sb

    # Commits con verificación
    cm = commit -m

    # Ver archivos modificados
    changed = diff --name-only

    # Deshacer último commit (mantener cambios)
    undo = reset HEAD~1 --soft

    # Ver contribuidores
    contributors = shortlog -sn --all --no-merges

    # Limpiar branches mergeadas
    cleanup = "!git branch --merged | grep -v '\\*\\|master\\|main\\|develop' | xargs -n 1 git branch -d"
```

Uso:
```bash
git lg              # Ver log bonito
git st              # Status corto
git contributors    # Ver quién ha contribuido
```

---

### 9. Workflow de Trabajo Diario

#### Inicio del día:
```bash
# Actualizar develop
git checkout develop
git pull origin develop

# Crear rama para nueva funcionalidad
git checkout -b feature/nombre-descriptivo

# Trabajar...
```

#### Durante el desarrollo:
```bash
# Ver cambios
git status
git diff

# Agregar cambios específicos
git add ruta/archivo.js

# Commit atómico
git commit -m "feat(android): agregar validación de email en registro"

# Seguir trabajando...
```

#### Fin del día:
```bash
# Push de la rama
git push -u origin feature/nombre-descriptivo

# Si la funcionalidad está completa, crear PR
# (en GitHub/GitLab)
```

---

### 10. Pull Requests

#### Template de PR (crear `.github/pull_request_template.md`):

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Nueva funcionalidad (feature)
- [ ] Corrección de bug (fix)
- [ ] Refactorización (refactor)
- [ ] Documentación (docs)

## ¿Cómo se probó?
- [ ] Tests unitarios
- [ ] Tests manuales
- [ ] Tests en dispositivo real

## Checklist
- [ ] Mi código sigue las guías de estilo del proyecto
- [ ] He realizado self-review de mi código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan warnings
- [ ] He agregado tests

## Screenshots (si aplica)

## Issues relacionados
Closes #
```

---

### 11. Revertir Cambios

#### Deshacer commit local (mantener cambios):
```bash
git reset --soft HEAD~1
```

#### Deshacer commit y cambios:
```bash
git reset --hard HEAD~1
```

#### Revertir commit ya pusheado:
```bash
git revert <commit-hash>
```

#### Limpiar archivos no trackeados:
```bash
git clean -fd
```

---

### 12. Cherry-pick

Aplicar commit específico de otra rama:
```bash
git cherry-pick <commit-hash>
```

Ejemplo:
```bash
# Estás en develop y quieres aplicar un fix de main
git cherry-pick abc123
```

---

### 13. Stash - Guardar Trabajo Temporal

```bash
# Guardar cambios sin commit
git stash save "descripción del trabajo en progreso"

# Ver stashes guardados
git stash list

# Aplicar último stash
git stash pop

# Aplicar stash específico
git stash apply stash@{0}

# Eliminar stash
git stash drop stash@{0}
```

---

### 14. Tags para Releases

```bash
# Crear tag anotado
git tag -a v1.0.0 -m "Release version 1.0.0 - Sistema completo de reconocimiento de frutas"

# Listar tags
git tag -l

# Push tags
git push origin v1.0.0

# Push todos los tags
git push --tags

# Crear release desde tag
git checkout v1.0.0
```

---

### 15. Squash Commits

Para limpiar historial antes de PR:

```bash
# Últimos 3 commits
git rebase -i HEAD~3

# En el editor, cambiar 'pick' por 'squash' en commits a unir
# Guardar y editar mensaje final
```

---

### 16. Resolver Conflictos

```bash
# Ver archivos con conflictos
git status

# Editar archivos manualmente o usar:
git mergetool

# Después de resolver:
git add .
git commit -m "fix: resolver conflictos de merge"
```

---

### 17. Buenas Prácticas - Checklist

Antes de cada commit:

- [ ] ¿El código compila sin errores?
- [ ] ¿Los tests pasan?
- [ ] ¿El mensaje de commit es descriptivo?
- [ ] ¿El commit es atómico (un cambio lógico)?
- [ ] ¿No incluye archivos de IDE?
- [ ] ¿No incluye secrets o credenciales?
- [ ] ¿El código está formateado?

---

### 18. Comandos de Emergencia

#### Recuperar commit eliminado:
```bash
git reflog
git checkout <commit-hash>
```

#### Cambiar mensaje del último commit:
```bash
git commit --amend -m "nuevo mensaje"
```

#### Agregar archivos olvidados al último commit:
```bash
git add archivo-olvidado.js
git commit --amend --no-edit
```

---

### 19. Integración Continua

Crear `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'

    - name: Install dependencies
      run: cd backend-FruitExplorer && npm install

    - name: Run tests
      run: cd backend-FruitExplorer && npm test

    - name: Run linter
      run: cd backend-FruitExplorer && npm run lint
```

---

### 20. Monitoreo del Repositorio

#### Ver tamaño del repositorio:
```bash
git count-objects -vH
```

#### Ver archivos más grandes:
```bash
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | \
  sort --numeric-sort --key=2 | \
  tail -10
```

---

## 📚 Recursos Adicionales

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Pro Git Book](https://git-scm.com/book/en/v2)

---

## 🎯 Objetivos del Equipo

### Corto Plazo (1 semana)
- [ ] Configurar git correctamente (todos)
- [ ] Actualizar .gitignore
- [ ] Usar mensajes de commit descriptivos
- [ ] Eliminar archivos .idea/ del repo

### Mediano Plazo (1 mes)
- [ ] Implementar branching strategy
- [ ] Configurar pre-commit hooks
- [ ] Aumentar cobertura de tests a 60%
- [ ] Documentar API

### Largo Plazo (3 meses)
- [ ] CI/CD completamente configurado
- [ ] Code coverage > 80%
- [ ] Documentación completa
- [ ] Release v1.0.0

---

**Recuerda:** Un buen historial de Git es documentación viviente del proyecto.

---

**Última actualización:** 18 de noviembre de 2025
**Mantenido por:** Equipo FruitExplorer
