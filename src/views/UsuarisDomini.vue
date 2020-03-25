<template>
  <div class="card shadow mb-4">
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Mostrar usuaris del domini</h6>
    </div>
    <div class="card-body">
      <form action="showusers.php" method="GET">
        <div class="form-group">
          <label for="groupsusuarisdomini" class="col-sm-2 col-form-label">Grups</label>
          <div class="col-sm-10">
            <select class="form-control" id="groupsusuarisdomini" name="group">
              <option value="">Tots</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
            <div class="form-check">
              <label class="form-check-label"> 
              <input class="form-check-input" id="onlyteachers" name="onlyteachers" type="checkbox"> Només professorat</label>
            </div>
        </div>
        <div class="form-group">
            <div class="form-check">
              <label class="form-check-label"> 
              <input class="form-check-input" id="onlyactive" name="onlyactive" type="checkbox"> Només usuaris actius</label>
            </div>
        </div>
        <div class="form-group">
            <div class="form-check">
              <label class="form-check-label"> 
                <input class="form-check-input" id="onlywithoutcode" name="onlywithoutcode" type="checkbox"> Només els usuaris sense ID
              </label>
            </div>
        </div>
        <div class="form-group">
            <div class="form-check">
              <label class="form-check-label">
                <input class="form-check-input" id="onlynotsession" name="onlynotsession" type="checkbox"> Només els usuaris que no han iniciat mai sessió
              </label>
            </div>
        </div>  
        <div class="form-group">
            <div class="form-check">
              <label class="form-check-label">
                <input class="form-check-input" id="onlywithoutorgunit" name="onlywithoutorgunit" type="checkbox"> Només els usuaris de la Unitat Organitzativa principal (/)
              </label>
            </div>
          </div>
        <div class="form-group">
          <input type="submit" class="btn btn-primary" value="Mostrar">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsuarisDomini'
}
</script>

<style>

</style>