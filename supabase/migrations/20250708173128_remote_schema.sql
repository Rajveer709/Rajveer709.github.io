create policy "Authenticated users can delete their own avatar."
on "storage"."objects"
as permissive
for delete
to authenticated
using ((auth.uid() = owner));


create policy "Authenticated users can update their own avatar."
on "storage"."objects"
as permissive
for update
to authenticated
using ((auth.uid() = owner));


create policy "Authenticated users can upload an avatar."
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'avatars'::text) AND (auth.uid() = owner)));


create policy "Avatar images are publicly accessible."
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));



