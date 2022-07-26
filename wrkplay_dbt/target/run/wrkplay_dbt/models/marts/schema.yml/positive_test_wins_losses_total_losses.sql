select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      

with validation as (

    select
        total_losses as positive

    from "postgres"."public"."wins_losses"

),

validation_errors as (

    select
        positive 

    from validation
    -- if this is true, then positive is actually negative!
    where positive < 0

)

select *
from validation_errors


      
    ) dbt_internal_test