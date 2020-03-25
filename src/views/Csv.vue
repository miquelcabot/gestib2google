<template>
  <div class="card shadow mb-4">
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Exportar a CSV</h6>
    </div>
    <div class="card-body">
      <form action="csv.php" method="GET">
        <div class="form-group">
          <label for="groupsusuarisdominicsv" class="col-sm-2 col-form-label">Grups</label>
          <div class="col-sm-10">
            <select class="form-control" id="groupsusuarisdominicsv" name="groupcsv">
              <option value="">Tots</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <div class="form-check">
            <label class="form-check-label"> 
            <input class="form-check-input" id="onlyteacherscsv" name="onlyteacherscsv" type="checkbox"> Només professorat</label>
          </div>
        </div>
        <div class="form-group">
          <input type="submit" class="btn btn-primary" value="Exportar">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Csv'
}
</script>

<style>

</style>