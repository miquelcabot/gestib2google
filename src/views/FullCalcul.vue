<template>
  <div class="card shadow mb-4">
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Exportar a un full de càlcul</h6>
    </div>
    <div class="card-body">
      <form action="spreadsheet.php" method="GET">
        <div class="form-group">
          <input type="submit" class="btn btn-primary" value="Exportar">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FullCalcul'
}
</script>

<style>

</style>
